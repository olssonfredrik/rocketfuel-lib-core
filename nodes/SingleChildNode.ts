import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { INode } from "./INode";
import { Node } from "./Node";
import { NullNode } from "./NullNode";

export class SingleChildNode extends Node
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): SingleChildNode
	{
		const nodeConfig = JSONUtil.AsType< ISingleChildNodeConfig >( config );
		const node = new SingleChildNode( nodeConfig.Name );
		if( !!nodeConfig.Child )
		{
			node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		}
		return node;
	}

	/** */
	protected child: INode = NullNode.Instance;

	/**
	 *
	 */
	public SetChild( child: INode ): void
	{
		this.child = child;
	}

	/**
	 * Returns the first node it finds with the given name.
	 */
	public FindNode( name: string ): INode | undefined
	{
		if( this.Name === name )
		{
			return this;
		}

		return this.child.FindNode( name );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		this.child.Render( renderer, camera );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.child.Update( deltaTime, transform, color );
	}
}

interface ISingleChildNodeConfig
{
	Name: string;
	Child?: IJSONObject;
}
