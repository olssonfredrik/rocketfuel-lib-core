import { Engine, EventManager, IEvent } from "../engine";
import { CircleShape, CursorState, IInputRegionConfig, InputManager, InputRegion, InputRegionState } from "../input";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { LeafNode } from "./LeafNode";

export class InputNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): InputNode
	{
		const nodeConfig = JSONUtil.AsType< IInputNodeConfig >( config );
		const inputRegion = InputRegion.FromConfig( nodeConfig.Input );
		return new InputNode( nodeConfig.Name, engine.InputManager, engine.EventManager, inputRegion, nodeConfig.Events );
	}

	private input: InputRegion;
	private inputManager: InputManager;
	private eventManager: EventManager;
	private events: Array< IEvent >;
	private stateType: InputRegionState;

	/**
	 *
	 */
	public constructor( name: string, inputManager: InputManager, eventManager: EventManager, inputRegion: InputRegion, events: Array< IEvent > )
	{
		super( name );
		this.input = inputRegion;
		this.inputManager = inputManager;
		this.eventManager = eventManager;
		this.events = events;
		this.stateType = InputRegionState.Pressed;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform )
	{
		super.Update( deltaTime, transform, color );

		if( this.input.GetStateChange( this.stateType ) )
		{
			this.events.forEach( ( event ) => this.eventManager.Send( event ) );
		}

		this.input.SetTransform( transform );
		this.inputManager.AddRegion( this.input );
	}

}

interface IInputNodeConfig
{
	Name: string;
	Input: IInputRegionConfig;
	Events: Array< IEvent >;
}
