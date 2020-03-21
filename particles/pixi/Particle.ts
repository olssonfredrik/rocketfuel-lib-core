import { Point2D } from "../../math";

export class Particle
{
	public Position: Point2D = new Point2D();
	public Velocity: Point2D = new Point2D();
	public Id: number = 0;
	public Rotation: number = 0;
	public RotationSpeed: number = 0;
	public NoRotation: boolean = false;
	public Life: number = 0;
	public NormalizedLifeFactor: number = 0;
	public Scale: number = 1;
	public ScaleFactor: number = 1;
	public SpeedFactor: number = 1;
	public Color: Array< number > = new Array< number >( 4 );
}
