import { IDataRead } from "../data";
import { Engine } from "../engine";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { INode } from "./INode";
import { NullNode } from "./NullNode";
import { SingleChildNode } from "./SingleChildNode";

export class ValueBooleanNode extends SingleChildNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): ValueBooleanNode
	{
		const nodeConfig = JSONUtil.AsType< IValueBooleanNodeConfig >( config );
		const value = engine.DataManager.GetRead( "value", nodeConfig.Value );
		const trueNode = engine.NodeFactory.Create( engine, nodeConfig.TrueNode );
		const falseNode = engine.NodeFactory.Create( engine, nodeConfig.FalseNode );

		return new ValueBooleanNode( nodeConfig.Name, value, trueNode, falseNode, nodeConfig.Threshold );
	}

	private readonly value: IDataRead< number >;
	private readonly trueNode: INode;
	private readonly falseNode: INode;
	private readonly threshold: number;

	/**
	 *
	 */
	public constructor( name: string, value: IDataRead< number >, trueNode: INode, falseNode: INode = NullNode.Instance, threshold: number = 0.5 )
	{
		super( name );

		this.value = value;
		this.trueNode = trueNode;
		this.falseNode = falseNode;
		this.threshold = threshold;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.SetChild( this.value.Get() > this.threshold ? this.trueNode : this.falseNode );
		super.Update( deltaTime, transform, color );
	}
}

interface IValueBooleanNodeConfig
{
	Name: string;
	Value: string;
	TrueNode: IJSONObject;
	FalseNode: IJSONObject;
	Threshold?: number;
}
