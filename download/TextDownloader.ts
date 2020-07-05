import { Downloader } from "./Downloader";
import { DownloaderState } from "./DownloaderState";

export class TextDownloader extends Downloader
{
	/**
	 *
	 */
	public Start(): void
	{
		this.state = DownloaderState.Downloading;
		const request = new XMLHttpRequest();
		request.open( "GET", this.GetUrl(), true );
		request.timeout = 5000;
		request.responseType = "text";

		request.onload = () =>
		{
			if( request.status === 200 && request.responseText.length > 0 )
			{
				this.data = request.responseText;
				this.state = DownloaderState.Done;
				this.errorMessage = "";
			}
			else
			{
				this.Fail( "http_" + request.status );
			}
		};

		request.onerror = () => this.Fail( "http_error" );
		request.ontimeout = () => this.Fail( "http_timeout" );

		window.setTimeout( () => { request.send(); }, 0 );
	}

	/**
	 *
	 */
	public GetData(): string
	{
		return ( this.data as string );
	}

	/**
	 *
	 */
	public SetData( data: string ): void
	{
		this.data = data;
		this.state = DownloaderState.Done;
	}
}
