import { IDataRead } from "../data";
import { Engine } from "../engine";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { INode } from "./INode";
import { SingleChildNode } from "./SingleChildNode";

export class ValueIndexNode extends SingleChildNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): ValueIndexNode
	{
		const nodeConfig = JSONUtil.AsType< IValueIndexNodeConfig >( config );
		const value = engine.DataManager.GetRead( "value", nodeConfig.Value );
		const children = nodeConfig.Children.map( ( child ) =>
		{
			return engine.NodeFactory.Create( engine, child );
		} );

		return new ValueIndexNode( nodeConfig.Name, value, children );
	}

	private readonly value: IDataRead< number >;
	private children: Array< INode >;

	/**
	 *
	 */
	public constructor( name: string, value: IDataRead< number >, children: Array< INode > )
	{
		super( name );

		this.value = value;
		this.children = children;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		const index = this.value.Get();
		this.SetChild( this.children[ index ] );
		super.Update( deltaTime, transform, color );
	}
}

interface IValueIndexNodeConfig
{
	Name: string;
	Value: string;
	Children: Array< IJSONObject >;
}
