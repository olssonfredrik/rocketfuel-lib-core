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
	private parentTransform: Transform;

	/**
	 *
	 */
	public constructor( name: string, alignment: Point2D, axis: Point2D )
	{
		super( name );
		this.alignment = new Point2D( alignment.X, alignment.Y );
		this.axis = new Point2D( axis.X, axis.Y );
		this.transform = new Transform();
		this.parentTransform = new Transform();
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.parentTransform = transform;
		this.transform.SetParent( transform );
		super.Update( deltaTime, this.transform, color );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		// We update the transform here because we need the camera
		const localPosition = PlaneTransform.ScreenToPlane( camera, this.parentTransform, new Point2D( camera.Size.X * this.alignment.X, camera.Size.Y * this.alignment.Y ) );

		mat4.fromTranslation( this.transform.GetLocal(), [ localPosition.X * this.axis.X, localPosition.Y * this.axis.Y, 0 ] );
		this.transform.SetDirty();

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
