import { mat4 } from "gl-matrix";
import { Camera, Engine } from "../engine";
import { IPoint2DConfig, PlaneTransform, Point2D, Transform } from "../math";
import { WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { SingleChildNode } from "./SingleChildNode";

export class CameraAlignmentNode extends SingleChildNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): CameraAlignmentNode
	{
		const nodeConfig = JSONUtil.AsType< ICameraAlignmentNodeConfig >( config );
		const node = new CameraAlignmentNode( nodeConfig.Name, Point2D.FromConfig( nodeConfig.Alignment ), Point2D.FromConfig( nodeConfig.Axis ) );
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private readonly alignment: Point2D;
	private readonly axis: Point2D;
	private readonly transform: Transform;
	private camera?: Camera;

	/**
	 *
	 */
	public constructor( name: string, alignment: Point2D, axis: Point2D )
	{
		super( name );
		this.alignment = alignment.Clone();
		this.axis = axis.Clone();
		this.transform = new Transform();
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.transform.SetParent( transform );
		if( !!this.camera )
		{
			const localPosition = PlaneTransform.ScreenToPlane( this.camera, transform, new Point2D( this.alignment.X * 2 - 1, 1 - 2 * this.alignment.Y ) );
			mat4.fromTranslation( this.transform.GetLocal(), [ localPosition.X * this.axis.X, localPosition.Y * this.axis.Y, 0 ] );
			this.transform.SetDirty();
		}
		super.Update( deltaTime, this.transform, color );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		this.camera = camera;
		super.Render( renderer, camera );
	}
}

interface ICameraAlignmentNodeConfig
{
	Name: string;
	Alignment: IPoint2DConfig;
	Axis: IPoint2DConfig;
	Child: IJSONObject;
}
