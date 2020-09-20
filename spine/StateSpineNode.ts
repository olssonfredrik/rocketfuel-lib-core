import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { INode } from "../nodes";
import { WebGLRenderer } from "../render";
import { Asserts, IJSONObject, JSONUtil } from "../util";
import { SpineNode } from "./SpineNode";
import { SpineState } from "./SpineState";

export class StateSpineNode implements INode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): StateSpineNode
	{
		const nodeConfig = JSONUtil.AsType< IStateSpineNodeConfig >( config );
		const spineNode = SpineNode.Create( engine, nodeConfig.SpineConfig );
		const node = new StateSpineNode( nodeConfig.Name, spineNode, nodeConfig.StartState );

		nodeConfig.Events?.forEach( ( event ) =>
		{
			Asserts.AssertDefined( event.Id );
			Asserts.AssertDefined( event.State );
			engine.EventManager.Subscribe( event.Id, () => node.SetState( event.State ) );
		} );

		return node;
	}

	public readonly Name: string;
	private readonly state: SpineState;
	private readonly spine: SpineNode;

	/**
	 * Creates an instance of StateSpineNode.
	 */
	public constructor( name: string, spineNode: SpineNode, startState: string )
	{
		this.Name = name;
		this.spine = spineNode;
		this.state = new SpineState( spineNode, startState );
	}

	/**
	 *
	 */
	public SetState( state: string, force: boolean = false ): Promise< boolean >
	{
		return this.state.SetState( state, force );
	}

	/**
	 *
	 */
	public GetState(): string
	{
		return this.state.GetState();
	}

	/**
	 *
	 */
	public Reset(): void
	{
		this.state.Reset();
	}

	/**
	 *
	 */
	public SetSkin( skin: string ): void
	{
		this.spine.SetSkin( skin );
	}

	/**
	 *
	 */
	public OverrideNode( slotId: string, attachmentId: string, node: INode ): void
	{
		this.spine.OverrideNode( slotId, attachmentId, node );
	}

	/**
	 *
	 */
	public FindNode( name: string ): INode | undefined
	{
		if( this.Name === name )
		{
			return this;
		}
		return this.spine.FindNode( name );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		this.spine.Render( renderer, camera );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.spine.Update( deltaTime, transform, color );
	}
}

interface IStateSpineNodeConfig
{
	Name: string;
	SpineConfig: IJSONObject;
	StartState: string;
	Events?: Array< IEventState >;
}

interface IEventState
{
	Id: string;
	State: string;
}
