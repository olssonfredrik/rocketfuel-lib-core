import { mat4, vec3 } from "gl-matrix";
import { IDataRead } from "../data";
import { Engine } from "../engine";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { SingleChildNode } from "./SingleChildNode";

export class TransformValueNode extends SingleChildNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): TransformValueNode
	{
		const nodeConfig = JSONUtil.AsType< ITransformValueNodeConfig >( config );
		const node = new TransformValueNode( nodeConfig.Name, engine.DataManager.GetRead( "Value", nodeConfig.Value ), nodeConfig.Scale );
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private readonly transform: Transform;
	private readonly matrix: mat4;
	private readonly position: vec3;
	private readonly x: IDataRead< number >;
	private readonly scale: number;

	/**
	 * Creates an instance of TransformValueNode.
	 */
	public constructor( name: string, x: IDataRead< number >, scale: number = 1 )
	{
		super( name );

		this.transform = new Transform();
		this.matrix = this.transform.GetLocal();
		this.position = vec3.create();
		this.x = x;
		this.scale = scale;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.transform.SetParent( transform );
		this.SetPosition( ( this.x.Get() - 0.5 ) * this.scale, 0, 0 );
		this.child.Update( deltaTime, this.transform, color );
	}

	/**
	 *
	 */
	private SetPosition( x: number, y: number, z: number ): void
	{
		const pos = this.position;
		if( x !== pos[ 0 ] || y !== pos[ 1 ] || z !== pos[ 2 ] )
		{
			vec3.set( pos, x, y, z );
			mat4.fromTranslation( this.matrix, pos );
			this.transform.SetDirty();
		}
	}
}

export interface ITransformValueNodeConfig
{
	Name: string;
	Value: string;
	Child: IJSONObject;
	Scale?: number;
}
