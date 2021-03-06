import { DataManager } from "../data";
import { FullscreenManager, HtmlHelper } from "../dom";
import { DownloadManager } from "../download";
import { InputManager } from "../input";
import { Point2D, Transform } from "../math";
import { INode, NodeFactory, SingleChildNode } from "../nodes";
import { ShaderManager, TextureManager, WebGLRenderer } from "../render";
import { SdfManager } from "../sdf";
import { SoundManager } from "../sound";
import { SpineManager } from "../spine";
import { TextManager } from "../text";
import { Asserts, JSONUtil } from "../util";
import { Utils } from "../util/Utils";
import { Analytics } from "./Analytics";
import { Camera } from "./Camera";
import { EventManager } from "./EventManager";
import { IInitConfig } from "./IInitConfig";
import { Locale } from "./Locale";

export class Engine
{
	public readonly Analytics: Analytics;
	public readonly DataManager: DataManager;
	public readonly DownloadManager: DownloadManager;
	public readonly EventManager: EventManager;
	public readonly InputManager: InputManager;
	public readonly NodeFactory: NodeFactory;
	public readonly Renderer: WebGLRenderer;
	public readonly SdfManager: SdfManager;
	public readonly ShaderManager: ShaderManager;
	public readonly SpineManager: SpineManager;
	public readonly TextureManager: TextureManager;
	public readonly TextManager: TextManager;
	public readonly SoundManager: SoundManager;
	public readonly FullscreenManager: FullscreenManager;

	private node: SingleChildNode = new SingleChildNode( "RootNode" );
	private transform: Transform = new Transform();
	private color: Transform = new Transform();
	private isRunning: boolean = false;
	private lastTime: number = 0;
	private inited: Promise< void >;
	private camera: Camera;
	private timeScale: number = 1.0;

	/**
	 * Creates an instance of Engine.
	 */
	public constructor( parentElement: HTMLElement, config: IInitConfig )
	{
		const maxSize = Point2D.FromConfig( config.Render.MaxSize );
		const canvas = HtmlHelper.CreateCanvas( maxSize );
		parentElement.appendChild( canvas );

		const glContext = HtmlHelper.CreateWebGLContext( canvas, config.Render.UseStencil, config.Render.UseDepth );
		Asserts.AssertNotNull( glContext, "WebGL Not supported!" );

		const safeZone = Point2D.FromConfig( config.Render.SafeZone );
		this.Renderer = new WebGLRenderer( glContext, safeZone, config.Render.UseStencil, config.Render.UseDepth );

		this.camera = new Camera( this.Renderer );
		Locale.Init( config.locale, config.currency );
		this.EventManager = new EventManager();
		this.Analytics = new Analytics( config.analytics_key );
		this.NodeFactory = new NodeFactory();
		this.InputManager = new InputManager( canvas );
		this.ShaderManager = new ShaderManager( this.Renderer );
		this.TextureManager = new TextureManager( this.Renderer );
		this.SdfManager = new SdfManager( this.TextureManager, this.ShaderManager );
		this.SpineManager = new SpineManager( this.Renderer, this.TextureManager );
		this.DataManager = new DataManager();
		this.TextManager = new TextManager();
		this.SoundManager = new SoundManager();
		this.FullscreenManager = new FullscreenManager( parentElement );
		HtmlHelper.ListenerToEvent( this.EventManager );
		this.EventManager.Subscribe( "Page:Reload", () => HtmlHelper.Reload() );
		this.EventManager.Subscribe( "Page:OpenUrl", ( id, args ) => HtmlHelper.OpenUrl( args?.[ 0 ] as string ) );
		Utils.Init( this.EventManager );

		this.DownloadManager = new DownloadManager( this.EventManager, config.resource_server, config.resource_file );
		this.inited = this.DownloadManager.Ready().then( () =>
		{
			return new Promise< void >( ( resolve ) =>
			{
				const data = this.DownloadManager.GetJson( "Config.json" );
				this.DataManager.Init( JSONUtil.GetAssertedJSONObject( data, "DataManager" ), this.EventManager );
				const text = this.DownloadManager.GetJson( "Text.json" );
				this.TextManager.Init( Locale.GetLocale(), this.DataManager, JSONUtil.GetAssertedJSONObject( text, "TextManager" ) );
				this.TextureManager.Init( JSONUtil.GetAssertedJSONArray( data, "TextureManager" ), this.DownloadManager );
				this.ShaderManager.Init( JSONUtil.GetAssertedJSONArray( data, "ShaderManager" ), this.DownloadManager );
				this.SdfManager.Init( JSONUtil.GetAssertedJSONObject( data, "FontManager" ), this.DownloadManager );
				this.SpineManager.Init( JSONUtil.GetAssertedJSONArray( data, "SpineManager" ), this.DownloadManager );
				this.SoundManager.Init( JSONUtil.GetAssertedJSONObject( data, "SoundManager" ), config.resource_server, this.DataManager, this.EventManager );
				this.FullscreenManager.Init( this.EventManager, this.DataManager );
				resolve();
			} );
		} );

		HtmlHelper.ResizeHandler( canvas, parentElement, this, safeZone, maxSize );
	}

	/**
	 *
	 */
	public Init(): Promise< void >
	{
		HtmlHelper.RequestAnimationFrame( this.InternalFrame );

		return this.inited;
	}

	/**
	 *
	 */
	public Start( rootNode: INode ): void
	{
		this.node.SetChild( rootNode );

		this.isRunning = true;
		this.lastTime = performance.now();

		// flush all events gathered during Construction/Init
		this.EventManager.Send( { EventId: "Engine:StartEvents" } );
		this.EventManager.Flush();
		this.EventManager.Flush();
	}

	/**
	 *
	 */
	public Frame( deltaTime: number )
	{
		this.node.Update( deltaTime, this.transform, this.color );

		this.Renderer.BeginFrame();
		this.camera.BeginFrame();
		this.node.Render( this.Renderer, this.camera );
		this.camera.EndFrame();
		this.Renderer.EndFrame();

		this.InputManager.Process( this.camera );
		this.EventManager.Send( { EventId: "Engine:EndFrame", Params: [ deltaTime ] }, false );
		this.EventManager.Flush();
	}

	/**
	 *
	 */
	private InternalFrame = (): void =>
	{
		if( this.isRunning )
		{
			const time = performance.now();
			this.Frame( Math.min( 1, ( time - this.lastTime ) * 0.001 ) * this.timeScale );
			this.lastTime = time;
		}
		else
		{
			this.DownloadManager.Update();
			this.EventManager.Flush();
		}

		HtmlHelper.RequestAnimationFrame( this.InternalFrame );
	}
}
