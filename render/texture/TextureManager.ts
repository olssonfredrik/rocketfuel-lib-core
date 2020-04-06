import { DownloadManager } from "../../download";
import { Point2D } from "../../math";
import { IJSONArray, MapUtil } from "../../util";
import { WebGLRenderer } from "../WebGLRenderer";
import { IRenderTarget } from "./IRenderTarget";
import { RenderTargetTexture } from "./RenderTargetTexture";
import { SubTexture } from "./SubTexture";
import { Texture } from "./Texture";

export class TextureManager
{
	private renderer: WebGLRenderer;
	private subTextures: Map< string, SubTexture >;
	private slots: Array< SubTexture | null >;
	private currentSlot: number;

	/**
	 * Creates an instance of TextureManager.
	 */
	public constructor( renderer: WebGLRenderer )
	{
		this.subTextures = new Map< string, SubTexture >();
		this.slots = [ null, null, null, null, null, null, null, null ];
		this.currentSlot = 0;
		this.renderer = renderer;
	}

	/**
	 *
	 */
	public Init( data: IJSONArray, downloadManager: DownloadManager )
	{
		const managerData = data as ( Array< { Id: string, Path: string, Pos: Array< number > } > );
		const textures = new Map< string, Texture >();
		managerData.forEach( ( subData ) =>
		{
			if( !textures.has( subData.Path ) )
			{
				textures.set( subData.Path, new Texture( this.renderer, downloadManager.GetImage( subData.Path ) ) );
			}
			this.subTextures.set( subData.Id, new SubTexture( MapUtil.AssertedGet( textures, subData.Path ), subData.Pos ) );
		} );
	}

	/**
	 *
	 */
	public CreateRenderTarget( name: string, size: Point2D, useAlpha: boolean ): IRenderTarget
	{
		const texture = new RenderTargetTexture( name, this.renderer, size, useAlpha );
		this.subTextures.set( name, new SubTexture( texture, [ 0, 0, 1, 1 ] ) );
		return texture;
	}

	/**
	 *
	 */
	public Size( id: string ): Point2D
	{
		return this.Get( id ).Size;
	}

	/**
	 *
	 */
	public TextureOffset( id: string ): Array< number >
	{
		return this.Get( id ).Position;
	}

	/**
	 *
	 */
	public SetActive( textures: Array< string > ): Array< Array< number > >
	{
		return textures.map( ( id, index ) => this.BindTexture( id, index ) );
	}

	/**
	 *
	 */
	private Get( id: string ): SubTexture
	{
		return MapUtil.AssertedGet( this.subTextures, id, "Unknown texture: [" + id + "]." );
	}

	/**
	 *
	 */
	private BindTexture( id: string, slot: number ): Array< number >
	{
		const subTexture = this.Get( id );
		if( subTexture !== this.slots[ slot ] )
		{
			if( this.slots[ slot ]?.Texture !== subTexture.Texture )
			{
				this.SetActiveSlot( slot );
				const gl = this.renderer.GetContext();
				gl.bindTexture( WebGLRenderingContext.TEXTURE_2D, subTexture.Texture.WebGLTexture );
			}
			this.slots[ slot ] = subTexture;
		}
		return subTexture.Position;
	}

	/**
	 *
	 */
	private SetActiveSlot( slot: number ): void
	{
		if( slot !== this.currentSlot )
		{
			const gl = this.renderer.GetContext();
			gl.activeTexture( WebGLRenderingContext.TEXTURE0 + slot );
			this.currentSlot = slot;
		}
	}
}
