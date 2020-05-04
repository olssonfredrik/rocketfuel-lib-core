import { spine } from "esotericsoftware-spine";
import { Engine, EventManager } from "../engine";
import { Shader, ShaderManager, TextureManager, WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { SpineNode } from "./SpineNode";
import { SpineState } from "./SpineState";

export class StateSpineNode extends SpineNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): StateSpineNode
	{
		const nodeConfig = JSONUtil.AsType< IStateSpineNodeConfig >( config );
		const shader = engine.ShaderManager.Get( nodeConfig.Shader ?? "RFLib/Spine" );
		const skeleton = engine.SpineManager.GetSkeleton( nodeConfig.Skeleton );
		const node = new StateSpineNode( nodeConfig.Name, skeleton, engine.EventManager, engine.ShaderManager, shader, nodeConfig.StartState, nodeConfig.Mixing );

		SpineNode.Override( node, engine, nodeConfig.Overrides );
		nodeConfig.Events?.forEach( ( event ) => engine.EventManager.Subscribe( event.Id, () => node.SetState( event.State ) ) );

		return node;
	}

	private state: SpineState;

	/**
	 * Creates an instance of StateSpineNode.
	 */
	public constructor( name: string, skeleton: spine.Skeleton, eventManager: EventManager, shaderManager: ShaderManager, shader: Shader, startState: string,
						mixing?: IAnimationMixData )
	{
		super( name, skeleton, eventManager, shaderManager, shader, mixing );
		this.state = new SpineState( this, startState );
	}

	/**
	 *
	 */
	public SetState( state: string, force: boolean = false ): Promise< boolean >
	{
		return this.state.SetState( state, force );
	}

	/**
	 *
	 */
	public GetState(): string
	{
		return this.state.GetState();
	}

	/**
	 *
	 */
	public Reset(): void
	{
		this.state.Reset();
	}
}

interface IStateSpineNodeConfig
{
	Name: string;
	Skeleton: string;
	StartState: string;
	Shader?: string;
	Overrides?: IJSONObject;
	Events?: Array< IEventAnimation >;
	Mixing?: IAnimationMixData;
}

interface IEventAnimation
{
	Id: string;
	State: string;
}

interface IAnimationMixData
{
	DefaultDuration?: number;
	List?: Array< { From: string, To: string, Duration: number } >;
}
