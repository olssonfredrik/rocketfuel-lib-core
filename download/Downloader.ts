import { Asserts } from "../util";
import { DownloaderState } from "./DownloaderState";

export abstract class Downloader
{
	protected data: unknown;
	protected state: DownloaderState;
	protected errorMessage: string;
	private url: string;
	private parameters = new Map< string, string >();

	/**
	 * Creates an instance of Downloader.
	 */
	public constructor( url: string )
	{
		this.url = url;
		this.state = DownloaderState.Ready;
		this.errorMessage = "";
	}

	/**
	 *
	 */
	public abstract Start(): void;

	/**
	 *
	 */
	public Retry(): void
	{
		this.Reset();
		this.Start();
	}

	/**
	 *
	 */
	public Reset(): void
	{
		this.data = null;
		this.state = DownloaderState.Ready;
		this.errorMessage = "";
	}

	/**
	 *
	 */
	public GetState(): DownloaderState
	{
		return this.state;
	}

	/**
	 *
	 */
	public GetData(): unknown
	{
		Asserts.Assert( this.state === DownloaderState.Done, "Tried to access data before download was complete." );
		return this.data;
	}

	/**
	 *
	 */
	public GetErrorCode(): string
	{
		return this.errorMessage;
	}

	/**
	 *
	 */
	public Fail( message: string ): void
	{
		this.errorMessage = message;
		this.state = DownloaderState.Failed;
	}

	/**
	 *
	 */
	public SetParameter( name: string, value: string )
	{
		this.parameters.set( name, value );
	}

	/**
	 *
	 */
	protected GetUrl(): string
	{
		let url = this.url;
		let prefix = ( url.indexOf( "?" ) >= 0 ) ? "&" : "?";
		this.parameters.forEach( ( value, key ) =>
		{
			url += prefix + key + "=" + value;
			prefix = "&";
		} );
		return url;
	}
}
