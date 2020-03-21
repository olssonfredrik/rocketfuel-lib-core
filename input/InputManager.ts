import { Camera } from "../engine";
import { PlaneTransform, Point2D } from "../math";
import { Cursor } from "./Cursor";
import { CursorState } from "./CursorState";
import { InputRegion } from "./InputRegion";
import { InputType } from "./InputType";
import { Pointer, PointerState } from "./pointer";

export class InputManager
{

	/**
	 * Get a ordered list of the intersected regions stopping at the first consuming region.
	 */
	private static Intersected( camera: Camera, regions: Array< InputRegion >, screenPosition: Point2D ): Array< InputRegion >
	{
		const output = new Array< InputRegion >();
		for( let i = regions.length - 1; i >= 0; i-- )
		{
			const region = regions[ i ];
			const localPosition = PlaneTransform.ScreenToPlane( camera, region.GetTransform(), screenPosition );
			if( region.Shape.IsInside( localPosition ) )
			{
				region.LocalPosition.Set( region.Shape.Normalize( localPosition ) );
				output.push( region );
				if( region.Consume )
				{
					break;
				}
			}
		}
		return output;
	}

	private frame: number;
	private cursor: Cursor;
	private mouseRegions: Array< InputRegion >;
	private touchRegions: Array< InputRegion >;

	private pointer: Pointer;

	/**
	 * Creates an instance of InputManager.
	 */
	public constructor( element: HTMLCanvasElement )
	{
		this.frame = 0;
		this.pointer = new Pointer( element );
		this.cursor = new Cursor( element );
		this.mouseRegions = new Array< InputRegion >();
		this.touchRegions = new Array< InputRegion >();
	}

	/**
	 * Call at the end of each frame
	 */
	public Process( camera: Camera ): void
	{
		const pointerState = this.pointer.GetState();
		const regions = ( pointerState.IsTouch ? this.touchRegions : this.mouseRegions );
		this.ProcessState( camera, pointerState, regions );

		// reset the regions for next frame
		this.mouseRegions.length = 0;
		this.touchRegions.length = 0;
	}

	/**
	 *
	 */
	public AddRegion( region: InputRegion, inputType: InputType = InputType.Both ): void
	{
		if( region.Frame !== this.frame )
		{
			region.Clear();
		}
		if( inputType === InputType.Mouse || inputType === InputType.Both )
		{
			this.mouseRegions.push( region );
		}
		if( inputType === InputType.Touch || inputType === InputType.Both )
		{
			this.touchRegions.push( region );
		}
	}

	/**
	 *
	 */
	private ProcessState( camera: Camera, state: PointerState, regions: Array< InputRegion > )
	{
		let cursor = CursorState.Default;
		this.frame++;

		if( state.Active )
		{
			const intersected = InputManager.Intersected( camera, regions, state.Position );
			for( const region of intersected )
			{
				region.Frame = this.frame;
				region.SetState( state.Last, state.Pressed );
				if( cursor === CursorState.Default )
				{
					cursor = region.Cursor;
				}
			}
		}

		regions.forEach( ( region ) =>
		{
			if( region.Frame !== this.frame )
			{
				region.Clear();
			}
		} );

		this.cursor.Set( cursor );
	}

}
