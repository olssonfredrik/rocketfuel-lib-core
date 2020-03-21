import { Engine } from "../engine";
import { AlwaysShape, CursorState, InputManager, InputRegion } from "../input";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { LeafNode } from "./LeafNode";

export class InputConsumerNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): InputConsumerNode
	{
		const nodeConfig = JSONUtil.AsType< IInputConsumerNodeConfig >( config );
		return new InputConsumerNode( nodeConfig.Name, engine.InputManager );
	}

	private input: InputRegion;
	private inputManager: InputManager;

	/**
	 *
	 */
	public constructor( name: string, inputManager: InputManager )
	{
		super( name );
		this.input = new InputRegion( new AlwaysShape(), true, CursorState.Default );
		this.inputManager = inputManager;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform )
	{
		super.Update( deltaTime, transform, color );

		this.inputManager.AddRegion( this.input );
	}

}

interface IInputConsumerNodeConfig
{
	Name: string;
}
