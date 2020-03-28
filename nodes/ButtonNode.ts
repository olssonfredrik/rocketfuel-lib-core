import { Engine, EventManager, IEvent } from "../engine";
import { CircleShape, CursorState, InputManager, InputRegion, InputRegionState } from "../input";
import { Transform } from "../math";
import { SpineNode } from "../spine";
import { IJSONObject, JSONUtil } from "../util";
import { CompositeNode } from "./CompositeNode";

export class ButtonNode extends CompositeNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): ButtonNode
	{
		const nodeConfig = JSONUtil.AsType< IButtonNodeConfig >( config );
		const player = engine.NodeFactory.Create( engine, nodeConfig.Player ) as SpineNode;
		return new ButtonNode( nodeConfig.Name, player, engine.InputManager, engine.EventManager, nodeConfig.Events );
	}

	private input: InputRegion;
	private inputManager: InputManager;
	private player: SpineNode;
	private state: InputRegionState;
	private animations: Array< string >;
	private eventManager: EventManager;
	private events: Array< IEvent >;

	/**
	 *
	 */
	public constructor( name: string, player: SpineNode, inputManager: InputManager, eventManager: EventManager, events: Array< IEvent > )
	{
		super( name );
		this.input = new InputRegion( new CircleShape( 65 ), true, CursorState.Pointer );
		this.inputManager = inputManager;
		this.player = player;
		this.state = InputRegionState.Up;
		this.animations = [ "hover", "up", "down", "down", "up" ];
		this.eventManager = eventManager;
		this.events = events;
		this.AddChild( player );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform )
	{
		super.Update( deltaTime, transform, color );

		const inputState = this.input.GetState();
		if( this.state !== inputState )
		{
			this.state = inputState;
			this.player.Play( this.animations[ this.state ] );
		}
		if( this.input.GetStateChange( InputRegionState.Released ) )
		{
			this.events.forEach( ( event ) => this.eventManager.Send( event ) );
		}

		this.input.SetTransform( transform );
		this.inputManager.AddRegion( this.input );
	}

}

interface IButtonNodeConfig
{
	Name: string;
	Player: IJSONObject;
	Events: Array< IEvent >;
}
