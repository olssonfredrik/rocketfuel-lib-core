import { spine } from "esotericsoftware-spine";
import { mat4 } from "gl-matrix";
import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { CompositeNode, INode } from "../nodes";
import { IPlayer } from "../player";
import { Shader, ShaderManager, TextureManager, WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil, Logging } from "../util";
import { ClipAttachment } from "./ClipAttachment";
import { MeshAttachment } from "./MeshAttachment";
import { NodeAttachment } from "./NodeAttachment";
import { RegionAttachment } from "./RegionAttachment";
import { SpineHelper } from "./SpineHelper";
import { SpinePlayer } from "./SpinePlayer";

export class SpineNode extends CompositeNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): SpineNode
	{
		const nodeConfig = JSONUtil.AsType< ISpineNodeConfig >( config );
		const shader = engine.ShaderManager.Get( nodeConfig.Shader );
		const skeleton = engine.SpineManager.GetSkeleton( nodeConfig.Skeleton );
		const node = new SpineNode( nodeConfig.Name, engine.Renderer, skeleton, engine.TextureManager, engine.ShaderManager, shader );
		Object.keys( nodeConfig.Overrides ?? {} ).forEach( ( key ) =>
		{
			const value = nodeConfig.Overrides[ key ] as IJSONObject;
			const parts = key.split( ":" );
			node.OverrideNode( parts[ 0 ], parts[ 1 ], engine.NodeFactory.Create( engine, value ) );
		} );

		nodeConfig.Events?.forEach( ( event ) => engine.EventManager.Subscribe( event.Id, () => node.Play( event.Animation, event.Loop ) ) );

		return node;
	}

	private transform: Transform = new Transform();
	private skeleton: spine.Skeleton;
	private animationState: spine.AnimationState;
	private shader: Shader;
	private clipShader: Shader;
	private matrixCache: mat4 = mat4.create();
	private currentClip: ClipAttachment | null;
	private player: IPlayer;

	/**
	 * Creates an instance of SpineNode.
	 */
	public constructor( name: string, renderer: WebGLRenderer, skeleton: spine.Skeleton, textureManager: TextureManager, shaderManager: ShaderManager, shader: Shader )
	{
		super( name );

		// Create an AnimationState, and set the initial animation in looping mode.
		const animationStateData = new spine.AnimationStateData( skeleton.data );
		const animationState = new spine.AnimationState( animationStateData );

		this.player = new SpinePlayer( animationState, skeleton.data );
		this.clipShader = shaderManager.Get( "RFLib/SolidColor" );
		this.skeleton = skeleton;
		this.animationState = animationState;
		this.shader = shader;
		this.currentClip = null;
	}

	/**
	 *
	 */
	public WrapPlayer( wrapper: ( player: IPlayer ) => IPlayer ): void
	{
		this.player = wrapper( this.player );
	}

	/**
	 *
	 */
	public Play( animation: string, loop: boolean = false ): Promise< void >
	{
		return this.player.Play( animation, loop );
	}

	/**
	 *
	 */
	public Stop(): void
	{
		this.player.Stop();
	}

	/**
	 *
	 */
	public HasAnimation( name: string ): boolean
	{
		return this.player.HasAnimation( name );
	}

	/**
	 *
	 */
	public OverrideNode( slotId: string, attachmentId: string, node: INode ): void
	{
		const slot = this.skeleton.drawOrder.find( ( drawSlot ) => ( drawSlot.data.name === slotId ) );
		if( !!slot )
		{
			const attachment = slot.getAttachment();
			if( attachment instanceof NodeAttachment && attachment.Name === attachmentId )
			{
				attachment.SetChild( node );
				return;
			}
		}
		Logging.Log( "OverrideNode failed. Attachment not found: [skeleton:" + this.skeleton.data.hash + " slot:"+ slotId + " attachment:" + attachmentId + "]" );
	}

	/**
	 *
	 */
	public FindNode( name: string ): INode | undefined
	{
		if( name === this.Name )
		{
			return this;
		}
		for( const slot of this.skeleton.drawOrder )
		{
			const attachment = slot.getAttachment();
			if( attachment instanceof NodeAttachment )
			{
				const childNode = attachment.FindNode( name );
				if( !!childNode )
				{
					return childNode;
				}
			}
		}
		return undefined;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		const skeleton = this.skeleton;

		this.animationState.update( deltaTime );
		this.animationState.apply( skeleton );
		this.skeleton.updateWorldTransform();
		this.transform.SetParent( transform );
		// TODO: set this.transform to skeleton.x, skeleton.y

		const matrix = this.matrixCache;
		for( const slot of skeleton.drawOrder )
		{
			const attachment = slot.getAttachment();

			// TODO: Should we only Update() on alpha > 0?
			if( attachment instanceof NodeAttachment )
			{
				attachment.SetColor( SpineHelper.SetColorMatrix( skeleton, slot, attachment, matrix ) );
				attachment.SetMatrix( SpineHelper.BoneToMatrix( slot.bone, matrix ) );
				attachment.Update( deltaTime, this.transform, color );
			}
			else if( attachment instanceof RegionAttachment || attachment instanceof MeshAttachment )
			{
				attachment.SetColor( SpineHelper.SetColorMatrix( skeleton, slot, attachment, matrix ) );
				attachment.Update( deltaTime, this.transform, color, slot );
			}
			else if( attachment instanceof ClipAttachment )
			{
				attachment.Update( deltaTime, this.transform, color, slot );
			}
		}
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		const blendModeStack = renderer.BlendModeStack;
		const skeleton = this.skeleton;
		this.currentClip = null;
		for( const slot of skeleton.drawOrder )
		{
			const attachment = slot.getAttachment();

			// Render Attachments
			if( attachment instanceof RegionAttachment || attachment instanceof MeshAttachment || attachment instanceof NodeAttachment )
			{
				blendModeStack.Push( slot.data.blendMode as number );
				if( attachment instanceof NodeAttachment )
				{
					attachment.Render( renderer, camera );
				}
				else
				{
					attachment.Render( renderer, camera, this.shader );
				}
				blendModeStack.Pop();
			}

			// Handle Clipping
			if( attachment instanceof ClipAttachment )
			{
				this.StartClip( renderer, camera, attachment );
				this.currentClip = attachment;
			}
			else if( this.currentClip !== null && this.currentClip.endSlot === slot.data )
			{
				this.StopClip( renderer );
			}
		}
		this.StopClip( renderer );
	}

	/**
	 *
	 */
	private StartClip( renderer: WebGLRenderer, camera: Camera, clipAttachment: ClipAttachment ): void
	{
		this.StopClip( renderer );
		clipAttachment.Shader = this.clipShader;
		renderer.StencilStack.Push( renderer, camera, ( clipRenderer, clipCamera ) =>
		{
			clipAttachment.Render( clipRenderer, clipCamera );
		} );
		this.currentClip = clipAttachment;
	}

	/**
	 *
	 */
	private StopClip( renderer: WebGLRenderer ): void
	{
		if( this.currentClip !== null )
		{
			renderer.StencilStack.Pop( renderer );
			this.currentClip = null;
		}
	}

}

interface ISpineNodeConfig
{
	Name: string;
	Skeleton: string;
	Shader: string;
	Overrides: IJSONObject;
	Events: Array< IEventAnimation >;
}

interface IEventAnimation
{
	Id: string;
	Animation: string;
	Loop: boolean;
}