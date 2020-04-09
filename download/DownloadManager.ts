import { EventManager } from "../engine";
import { Asserts, IJSONObject, Logging } from "../util";
import { Downloader } from "./Downloader";
import { DownloaderState } from "./DownloaderState";
import { IDownloadListItem } from "./IDownloadListItem";
import { ImageDownloader } from "./ImageDownloader";
import { TextDownloader } from "./TextDownloader";

export class DownloadManager
{
	private list: Map< string, Downloader > = new Map< string, Downloader >();
	private multi: Array< string > = new Array< string >();
	private maxConcurrent: number = 16;
	private total: number = 0;
	private retryCount: number = 0;
	private downloadList: TextDownloader;
	private isDone: boolean;
	private baseUrl: string;
	private doneDownloading: () => void;
	private eventManager: EventManager;

	/**
	 *
	 */
	public constructor( eventManager: EventManager, baseUrl: string, url: string )
	{
		this.eventManager = eventManager;
		this.isDone = false;
		this.baseUrl = baseUrl;
		this.doneDownloading = () => {};
		this.downloadList = new TextDownloader( baseUrl + url );
		this.downloadList.Start();
	}

	/**
	 *
	 */
	public Ready(): Promise< number >
	{
		return new Promise< number >( ( resolve, reject ) =>
		{
			if( this.isDone )
			{
				resolve();
			}
			else
			{
				this.doneDownloading = resolve;
			}
		} );
	}

	/**
	 *
	 */
	public Update(): boolean
	{
		if( this.isDone )
		{
			return true;
		}

		if( this.list.size === 0 )
		{
			switch( this.downloadList.GetState() )
			{
				case DownloaderState.Failed:
					if( this.retryCount++ < 5 )
					{
						this.downloadList.Retry();
					}
					else
					{
						Logging.Error( "Failed to download resources." );
					}
					break;

				case DownloaderState.Done:
					const data = ( JSON.parse( this.downloadList.GetData() ) as Array< IDownloadListItem > );
					this.AddList( data );
					break;
			}

			return false;
		}

		// We are still in the act of downloading
		this.eventManager.Send( { EventId: "Download:Update", Params: [ this.GetProgress() ] } );

		const done = this.GetStateCount( DownloaderState.Done );
		if( done === this.total )
		{
			if( this.ExpandMulti() )
			{
				return false;
			}
			this.isDone = true;
			this.doneDownloading();
			return true;
		}

		const downloading = this.GetStateCount( DownloaderState.Downloading );
		if( downloading >= this.maxConcurrent )
		{
			return false;
		}

		const ready = this.GetNextState( DownloaderState.Ready );
		if( !!ready )
		{
			ready.Start();
			return false;
		}

		const failed = this.GetNextState( DownloaderState.Failed );
		if( !!failed )
		{
			failed.Retry();
			return false;
		}

		return false;
	}

	/**
	 *
	 */
	public GetProgress(): number
	{
		const done = this.GetStateCount( DownloaderState.Done );
		return done / this.total;
	}

	/**
	 *
	 */
	public GetImage( id: string ): HTMLImageElement
	{
		return ( this.Get( id ) as ImageDownloader ).GetData();
	}

	/**
	 *
	 */
	public GetText( id: string ): string
	{
		return ( this.Get( id ) as TextDownloader ).GetData();
	}

	/**
	 *
	 */
	public GetJson( id: string ): IJSONObject
	{
		return JSON.parse( this.GetText( id ) );
	}

	/**
	 *
	 */
	private Get( id: string ): Downloader
	{
		const downloader = this.list.get( id );
		Asserts.AssertDefined( downloader, "Unknown resource: " + id );
		return downloader;
	}

	/**
	 *
	 */
	private AddList( list: Array< IDownloadListItem > ): void
	{
		list.forEach( ( item ) =>
		{
			this.Add( item.Id, item.Url, item.Type );
		} );
	}

	/**
	 *
	 */
	private Add( id: string, url: string, type: string ): void
	{
		Asserts.Assert( !this.list.has( id ), "Duplicate entry: " + id );

		this.isDone = false;
		switch( type )
		{
			case "image":
				this.list.set( id, new ImageDownloader( this.baseUrl + url ) );
				break;

			case "text":
			case "json":
				this.list.set( id, new TextDownloader( this.baseUrl + url ) );
				break;

			case "multi":
				this.list.set( id, new TextDownloader( this.baseUrl + url ) );
				this.multi.push( id );
				break;

			default:
				Logging.Error( "Unsupported download type '" + type + "'." );
		}
		this.total++;
	}

	/**
	 *
	 */
	private GetStateCount( state: DownloaderState ): number
	{
		let count = 0;
		this.list.forEach( ( downloader ) =>
		{
			if( state === downloader.GetState() )
			{
				count++;
			}
		} );
		return count;
	}

	/**
	 *
	 */
	private GetNextState( state: DownloaderState ): Downloader | undefined
	{
		let next: Downloader | undefined;
		this.list.forEach( ( downloader ) =>
		{
			if( next === undefined && state === downloader.GetState() )
			{
				next = downloader;
			}
		} );
		return next;
	}

	/**
	 *
	 */
	private ExpandMulti(): boolean
	{
		const multiFile = this.multi.pop();
		if( !!multiFile )
		{
			const json = this.GetJson( multiFile );
			Object.keys( json ).forEach( ( file ) =>
			{
				const data = decodeURIComponent( escape( window.atob( json[ file ] as string ) ) );
				const downloader = new TextDownloader( "multifile" );
				downloader.SetData( data );
				this.list.set( file, downloader );
				this.total++;
			} );
			return true;
		}
		return false;
	}
}
