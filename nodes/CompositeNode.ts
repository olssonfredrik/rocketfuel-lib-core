import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { INode } from "./INode";
import { Node } from "./Node";

/**
 * Base node implementation. Use this node if all you need is a container and
 * extend if you need anything more complicated.
 */
export class CompositeNode extends Node
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): CompositeNode
	{
		const nodeConfig = JSONUtil.AsType< ICompositeNodeConfig >( config );
		const node = new CompositeNode( nodeConfig.Name );
		nodeConfig.Children.forEach( ( child ) =>
		{
			node.AddChild( engine.NodeFactory.Create( engine, child ) );
		} );
		return node;
	}

	/** All the children */
	protected children: Array< INode >;

	/**
	 *
	 */
	public constructor( name: string )
	{
		super( name );
		this.children = new Array< INode >();
	}

	/**
	 * Add a child to this node
	 */
	public AddChild( child: INode )
	{
		this.children.push( child );
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

		for( const node of this.children )
		{
			const found = node.FindNode( name );
			if( !!found )
			{
				return found;
			}
		}

		return undefined;
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		for( const node of this.children )
		{
			node.Render( renderer, camera );
		}
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		for( const node of this.children )
		{
			node.Update( deltaTime, transform, color );
		}
	}
}

interface ICompositeNodeConfig
{
	Name: string;
	Children: Array< IJSONObject >;
}
