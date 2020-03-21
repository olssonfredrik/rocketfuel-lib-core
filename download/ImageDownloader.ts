import { Downloader } from "./Downloader";
import { DownloaderState } from "./DownloaderState";

export class ImageDownloader extends Downloader
{
	/**
	 *
	 */
	public Start(): void
	{
		const image = new Image();

		image.onload = () =>
		{
			this.data = image;
			this.state = DownloaderState.Done;
		};

		image.onerror = () =>
		{
			this.state = DownloaderState.Failed;
		};

		image.crossOrigin = "anonymous";
		image.src = this.GetUrl();
	}

	/**
	 *
	 */
	public GetData(): HTMLImageElement
	{
		return ( this.data as HTMLImageElement );
	}
}
