import { spine } from "esotericsoftware-spine";
import { DownloadManager } from "../download";
import { TextureManager, WebGLRenderer } from "../render";
import { MapUtil } from "../util";
import { AttachmentLoader } from "./attachment";

export class SpineManager
{
	private skeletons: Map< string, unknown > = new Map< string, unknown >();
	private skeletonJson: spine.SkeletonJson;

	/**
	 * Creates an instance
	 */
	public constructor( renderer: WebGLRenderer, textureManager: TextureManager )
	{
		this.skeletonJson = new spine.SkeletonJson( new AttachmentLoader( renderer, textureManager ) );
	}

	/**
	 *
	 */
	public Init( data: object, downloadManager: DownloadManager )
	{
		const spines = data as ( Array< { Id: string, Path: string } > );
		spines.forEach( ( spineData ) => this.SetSkeleton( spineData.Id, downloadManager.GetJson( spineData.Path ) ) );
	}

	/**
	 *
	 */
	public GetSkeleton( name: string ): spine.Skeleton
	{
		const data = MapUtil.AssertedGet( this.skeletons, name, "Unable to find spine.Skeleton for name [" + name + "]." );
		const skeletonData = this.skeletonJson.readSkeletonData( data );
		return new spine.Skeleton( skeletonData );
	}

	/**
	 *
	 */
	public SetSkeleton( name: string, skeletonData: unknown ): void
	{
		this.skeletons.set( name, skeletonData );
	}
}
