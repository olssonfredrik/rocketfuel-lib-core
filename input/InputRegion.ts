import { Point2D, Transform } from "../math";
import { CursorState } from "./CursorState";
import { InputRegionState } from "./InputRegionState";
import { IShape, IShapeConfig, Shape } from "./shape";

export class InputRegion
{
	/**
	 *
	 */
	public static FromConfig( config: IInputRegionConfig ): InputRegion
	{
		const shape = Shape.FromConfig( config.Shape );
		return new InputRegion( shape, config.Consume, config.Cursor as CursorState );
	}

	public readonly Shape: IShape;
	public readonly Consume: boolean;
	public readonly Cursor: CursorState;
	public readonly LocalPosition: Point2D;

	public Frame: number = 0;

	private transform: Transform;
	private currentState: InputRegionState = InputRegionState.Up;
	private lastState: InputRegionState = InputRegionState.Up;

	private downState: Array< InputRegionState >;
	private downAndLastState: Array< InputRegionState >;
	private upState: Array< InputRegionState >;

	/**
	 * Creates an instance of InputRegion.
	 */
	public constructor( shape: IShape, consume: boolean = true, cursor: CursorState = CursorState.Pointer )
	{
		this.downState = new Array< InputRegionState >();
		this.downState[ InputRegionState.Hover ] = InputRegionState.Pressed;
		this.downState[ InputRegionState.Up ] = InputRegionState.Pressed;
		this.downState[ InputRegionState.Pressed ] = InputRegionState.Pressed;
		this.downState[ InputRegionState.Down ] = InputRegionState.Down;
		this.downState[ InputRegionState.Released ] = InputRegionState.Pressed;

		this.downAndLastState = new Array< InputRegionState >();
		this.downAndLastState[ InputRegionState.Hover ] = InputRegionState.Down;
		this.downAndLastState[ InputRegionState.Up ] = InputRegionState.Down;
		this.downAndLastState[ InputRegionState.Pressed ] = InputRegionState.Pressed;
		this.downAndLastState[ InputRegionState.Down ] = InputRegionState.Down;
		this.downAndLastState[ InputRegionState.Released ] = InputRegionState.Pressed;

		this.upState = new Array< InputRegionState >();
		this.upState[ InputRegionState.Hover ] = InputRegionState.Hover;
		this.upState[ InputRegionState.Up ] = InputRegionState.Hover;
		this.upState[ InputRegionState.Pressed ] = InputRegionState.Released;
		this.upState[ InputRegionState.Down ] = InputRegionState.Released;
		this.upState[ InputRegionState.Released ] = InputRegionState.Hover;

		this.transform = new Transform();

		this.Shape = shape;
		this.Consume = consume;
		this.Cursor = cursor;
		this.LocalPosition = new Point2D( 0, 0 );
		this.Clear();
	}

	/**
	 *
	 */
	public SetState( last: boolean, current: boolean ): void
	{
		this.lastState = this.currentState;
		const regionStates = ( current ? ( last ? this.downAndLastState : this.downState ) : this.upState );
		const newState = regionStates[ this.currentState ];
		this.currentState = newState;
	}

	/**
	 *
	 */
	public GetStateChange( state: InputRegionState ): boolean
	{
		return ( state !== this.lastState && state === this.currentState );
	}

	/**
	 *
	 */
	public GetState(): InputRegionState
	{
		return this.currentState;
	}

	/**
	 *
	 */
	public Clear(): void
	{
		this.Frame = -1;
		this.currentState = InputRegionState.Up;
		this.lastState = InputRegionState.Up;
	}

	/**
	 *
	 */
	public SetTransform( transform: Transform )
	{
		this.transform = transform;
	}

	/**
	 *
	 */
	public GetTransform(): Transform
	{
		return this.transform;
	}
}

export interface IInputRegionConfig
{
	Shape: IShapeConfig;
	Consume?: boolean;
	Cursor?: string;
}
