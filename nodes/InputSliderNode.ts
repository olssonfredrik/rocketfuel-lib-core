import { IDataWrite } from "../data";
import { Engine } from "../engine";
import { IInputRegionConfig, InputManager, InputRegion, InputRegionState } from "../input";
import { Point2D, Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { LeafNode } from "./LeafNode";

export class InputSliderNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): InputSliderNode
	{
		const nodeConfig = JSONUtil.AsType< IInputSliderNodeConfig >( config );
		const inputRegion = InputRegion.FromConfig( nodeConfig.Input );
		const value = engine.DataManager.GetWrite( "Value", nodeConfig.Value );
		return new InputSliderNode( nodeConfig.Name, engine.InputManager, inputRegion, value, nodeConfig.ActiveRange, nodeConfig.Horizontal );
	}

	private readonly input: InputRegion;
	private readonly inputManager: InputManager;
	private readonly value: IDataWrite< number >;
	private readonly valueFunction: ( p: Point2D ) => number;

	/**
	 *
	 */
	public constructor( name: string, inputManager: InputManager, inputRegion: InputRegion, value: IDataWrite< number >, activeRange: number = 1, horizontal: boolean = true )
	{
		super( name );
		this.input = inputRegion;
		this.inputManager = inputManager;
		this.value = value;

		this.valueFunction = ( p: Point2D ) =>
		{
			const v = ( Math.min( activeRange, Math.max( -activeRange, horizontal ? p.X : p.Y ) ) / activeRange );
			return ( v + 1 ) / 2;
		};
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform )
	{
		super.Update( deltaTime, transform, color );

		if( this.input.GetState() === InputRegionState.Pressed )
		{
			this.value.Set( this.valueFunction( this.input.LocalPosition ) );
		}

		this.input.SetTransform( transform );
		this.inputManager.AddRegion( this.input );
	}

}

interface IInputSliderNodeConfig
{
	Name: string;
	Input: IInputRegionConfig;
	Value: string;
	ActiveRange: number;
	Horizontal?: boolean;
}
