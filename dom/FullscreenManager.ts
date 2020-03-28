import { DataManager } from "../data";
import { EventManager } from "../engine";

declare global
{
	// tslint:disable-next-line: interface-name
	interface Document
	{
		msCancelFullScreen?: () => Promise< void >;
		mozCancelFullScreen?: () => Promise< void >;
		webkitCancelFullScreen?: () => Promise< void >;
		msExitFullscreen?: () => Promise< void >;
		webkitExitFullscreen?: () => Promise< void >;

		mozFullScreenElement?: Element;
		msFullscreenElement?: Element;
		webkitFullscreenElement?: Element;
	}

	// tslint:disable-next-line: interface-name
	interface HTMLElement
	{
		msRequestFullscreen?: () => Promise< void >;
		webkitRequestFullscreen?: () => Promise< void >;
		mozRequestFullScreen?: () => Promise< void >;
	}
}

export class FullscreenManager
{
	private readonly element: HTMLElement;

	/**
	 *
	 */
	public constructor( element: HTMLElement )
	{
		this.element = element;
	}

	/**
	 *
	 */
	public Init( eventManager: EventManager, dataManager: DataManager ): void
	{
		const fullscreenValue = dataManager.GetWrite( "Value", "Fullscreen:Active" );
		const hasFullscreen = this.HasFullscreen();

		if( hasFullscreen )
		{
			eventManager.Subscribe( "Fullscreen:Toggle", () =>
			{
				const isFullscreen = this.IsFullscreen();
				if( isFullscreen )
				{
					this.ExitFullscreen();
				}
				else
				{
					this.SetFullscreen();
				}
			} );

			eventManager.Subscribe( "Fullscreen:Update", () =>
			{
				const isFullscreen = this.IsFullscreen();
				fullscreenValue.Set( isFullscreen ? 1 : 0 );
			} );
		}
		dataManager.GetWrite( "Value", "Fullscreen:Supported" ).Set( hasFullscreen ? 1 : 0 );
	}

	/**
	 *
	 */
	private SetFullscreen(): void
	{
		const element = this.element;
		const requestFunction = element.requestFullscreen ?? element.msRequestFullscreen ?? element.webkitRequestFullscreen ?? element.mozRequestFullScreen;
		requestFunction?.call( element )?.catch( ( err ) => {} );
	}

	/**
	 *
	 */
	private ExitFullscreen(): void
	{
		const exitFunction = document.exitFullscreen ?? document.msCancelFullScreen ?? document.webkitCancelFullScreen ?? document.mozCancelFullScreen;
		exitFunction?.call( document )?.catch( ( err ) => {} );
	}

	/**
	 *
	 */
	private IsFullscreen(): boolean
	{
		const fullscreenElement = document.fullscreenElement ?? document.mozFullScreenElement ?? document.webkitFullscreenElement ?? document.msFullscreenElement;
		return ( !!fullscreenElement );
	}

	/**
	 *
	 */
	private HasFullscreen(): boolean
	{
		const element = this.element;
		const requestFunction = element.requestFullscreen ?? element.msRequestFullscreen ?? element.webkitRequestFullscreen ?? element.mozRequestFullScreen;
		return ( !!requestFunction );
	}
}
