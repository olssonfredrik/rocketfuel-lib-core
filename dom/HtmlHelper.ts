import { Engine, EventManager } from "../engine";
import { Point2D } from "../math";
import { CanvasTransform } from "./CanvasTransform";

declare global
{
	// tslint:disable-next-line: interface-name
	interface Window
	{
		msRequestAnimationFrame?: ( callback: FrameRequestCallback ) => number;
		mozRequestAnimationFrame?: ( callback: FrameRequestCallback ) => number;
	}
}

/**
 * Helper class for different Web/DOM/HTML tasks
 */
export class HtmlHelper
{
	/**
	 * Reloads the page
	 */
	public static Reload(): void
	{
		window.location.reload();
	}

	/**
	 *
	 */
	public static OpenUrl( url: string ): void
	{
		window.open( url );
	}

	/**
	 *
	 */
	public static RequestAnimationFrame( func: () => void ): void
	{
		const requestFunction = window.requestAnimationFrame ?? window.msRequestAnimationFrame ?? window.webkitRequestAnimationFrame ?? window.mozRequestAnimationFrame;
		if( !!requestFunction )
		{
			requestFunction.call( window, func );
		}
		else
		{
			window.setTimeout( func, 16 );
		}
	}

	/**
	 * Try to create a WebGL Context. Will return undefined on fail.
	 */
	public static CreateWebGLContext( canvas: HTMLCanvasElement ): WebGLRenderingContext | undefined
	{
		// TODO: Handle context lost/restored
		const contextIdList: Array< string > = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];

		for( const contextId of contextIdList )
		{
			const context = canvas.getContext( contextId, { stencil: true, premultipliedAlpha: true, alpha: false, antialias: false } );
			if( !!context )
			{
				return ( context as WebGLRenderingContext );
			}
		}

		return undefined;
	}

	/**
	 * Create a Canvas
	 */
	public static CreateCanvas( size: Point2D ): HTMLCanvasElement
	{
		const canvas = document.createElement( "canvas" );

		// set a default size to make sure we dont div by zero before first resize
		canvas.width = size.X;
		canvas.height = size.Y;

		return canvas;
	}

	/**
	 * Resize the canvas to always fit to the parent size, while maintaining a correct aspect ratio
	 */
	public static ResizeHandler( canvas: HTMLCanvasElement, parent: HTMLElement, engine: Engine, safeZone: Point2D, maxSize: Point2D ): void
	{
		const canvasTransform = new CanvasTransform( canvas );

		const safeZoneSize = ( size: Point2D ): Point2D =>
		{
			const horizontalScale = size.X / safeZone.X;
			const verticalScale = size.Y / safeZone.Y;
			const scale = Math.min( horizontalScale, verticalScale );
			const max = maxSize.Clone().Scale( scale );
			max.X = Math.min( max.X, size.X );
			max.Y = Math.min( max.Y, size.Y );

			return max;
		};

		// TODO: throttling & sync with WebGL somehow
		const resize = () =>
		{
			const pixelRatio = window.devicePixelRatio;
			const pixelSize = new Point2D( parent.clientWidth, parent.clientHeight ).Scale( pixelRatio );
			const newSize = safeZoneSize( pixelSize );

			const scale = Math.max( 1.0, newSize.X / maxSize.X, newSize.Y / maxSize.Y );
			newSize.Scale( 1 / scale );

			const size = engine.Renderer.Size;
			if( size.X >= size.Y && newSize.X < newSize.Y )
			{
				engine.EventManager.Send( { EventId: "Screen:Portrait" } );
			}
			if( size.X < size.Y && newSize.X >= newSize.Y )
			{
				engine.EventManager.Send( { EventId: "Screen:Landscape" } );
			}

			size.Set( newSize );
			canvas.width = newSize.X;
			canvas.height = newSize.Y;

			canvasTransform.SetTransform( pixelSize.Scale( 0.5 / scale ), scale / pixelRatio );
		};

		window.onorientationchange = resize;
		window.onresize = resize;
		resize();
	}

	/**
	 *
	 */
	public static ListenerToEvent( eventManager: EventManager ): void
	{
		document.addEventListener( "visibilitychange", () =>
		{
			const id = ( document.hidden ? "Document:Hidden" : "Document:Visible" );
			eventManager.Send( { EventId: id } );
		}, false );

		HtmlHelper.AddEventListener( [ "fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange" ], () =>
		{
			eventManager.Send( { EventId: "Fullscreen:Update" } );
		} );
	}

	/**
	 *
	 */
	public static AddEventListener( events: Array< string >, listener: ( this: Document, ev: Event ) => void )
	{
		events.forEach( ( event ) => document.addEventListener( event, listener ) );
	}
}
