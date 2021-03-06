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
	public static CreateWebGLContext( canvas: HTMLCanvasElement, useStencil: boolean = true, useDepth: boolean = false ): WebGLRenderingContext | undefined
	{
		// TODO: Handle context lost/restored
		const contextIdList: Array< string > = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];

		for( const contextId of contextIdList )
		{
			const context = canvas.getContext( contextId, { stencil: useStencil, depth: useDepth, premultipliedAlpha: true, alpha: true, antialias: false } );
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
		const safeRatio = safeZone.X / safeZone.Y;
		let forceEvents = true;

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

		const pixelToWorldSize = ( size: Point2D ): Point2D =>
		{
			const ratio = size.X / size.Y;

			const width = ( ratio > safeRatio ) ? safeZone.Y * ratio : safeZone.X;
			const height = ( ratio > safeRatio ) ? safeZone.Y : safeZone.X / ratio;

			return new Point2D( width, height );
		};

		// TODO: throttling & sync with WebGL somehow
		const resize = () =>
		{
			const pixelRatio = window.devicePixelRatio;
			const pixelSize = new Point2D( parent.clientWidth, parent.clientHeight ).Scale( pixelRatio );
			const newSize = safeZoneSize( pixelSize );

			const scale = Math.max( 1.0, newSize.X / maxSize.X, newSize.Y / maxSize.Y );
			newSize.Scale( 1 / scale );

			// RenderSize
			engine.Renderer.RenderSize.Set( newSize );
			canvas.width = newSize.X;
			canvas.height = newSize.Y;
			canvasTransform.SetTransform( pixelSize.Scale( 0.5 / pixelRatio ), scale / pixelRatio );

			// WorldSize
			const oldWorldSize = engine.Renderer.WorldSize.Clone();
			const newWorldSize = pixelToWorldSize( newSize );
			engine.Renderer.WorldSize.Set( newWorldSize );

			// Orientation
			if( newWorldSize.X < newWorldSize.Y && ( oldWorldSize.X >= oldWorldSize.Y || forceEvents ) )
			{
				engine.EventManager.Send( { EventId: "Screen:Portrait" } );
			}
			if( newWorldSize.X >= newWorldSize.Y && ( oldWorldSize.X < oldWorldSize.Y || forceEvents ) )
			{
				engine.EventManager.Send( { EventId: "Screen:Landscape" } );
			}

			// Overflow (ie. on what axis are we outside the saze zone)
			const oldRatio = oldWorldSize.X / oldWorldSize.Y;
			const newRatio = newWorldSize.X / newWorldSize.Y;
			if( newRatio < safeRatio && ( oldRatio >= safeRatio || forceEvents ) )
			{
				engine.EventManager.Send( { EventId: "Screen:OverflowVertically" } );
			}
			if( newRatio > safeRatio && ( oldRatio <= safeRatio || forceEvents ) )
			{
				engine.EventManager.Send( { EventId: "Screen:OverflowHorizontally" } );
			}
			forceEvents = false;
		};

		engine.EventManager.Subscribe( "Engine:StartEvents", () =>
		{
			forceEvents = true;
			resize();
		} );

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

	/**
	 *
	 */
	public static NormalizeInput( position: Point2D, canvas: HTMLCanvasElement ): void
	{
		const normalizedX = ( 2.0 * position.X ) / canvas.width - 1.0;
		const normalizedY = 1.0 - ( 2.0 * position.Y ) / canvas.height;
		position.SetValues( normalizedX, normalizedY );
	}
}
