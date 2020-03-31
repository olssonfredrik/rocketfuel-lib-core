import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { INode } from "./INode";
import { SingleChildNode } from "./SingleChildNode";

export class StencilNode extends SingleChildNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): StencilNode
	{
		const nodeConfig = JSONUtil.AsType< IStencilNodeConfig >( config );
		const stencil = engine.NodeFactory.Create( engine, nodeConfig.Stencil );
		const node = new StencilNode( nodeConfig.Name, stencil );
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private readonly stencil: INode;

	/**
	 *
	 */
	public constructor( name: string, stencil: INode )
	{
		super( name );

		this.stencil = stencil;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.stencil.Update( deltaTime, transform, color );
		this.child.Update( deltaTime, transform, color );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		renderer.StencilStack.Push( renderer, camera, ( stencilRenderer, stencilCamera ) => this.stencil.Render( stencilRenderer, stencilCamera ) );
		this.child.Render( renderer, camera );
		renderer.StencilStack.Pop( renderer );
	}
}

export interface IStencilNodeConfig
{
	Name: string;
	Stencil: IJSONObject;
	Child: IJSONObject;
}
