import { spine } from "esotericsoftware-spine";
import { TextureManager, WebGLRenderer } from "../render";
import { ClipAttachment } from "./ClipAttachment";
import { MeshAttachment } from "./MeshAttachment";
import { NodeAttachment } from "./NodeAttachment";
import { RegionAttachment } from "./RegionAttachment";
export class AttachmentLoader implements spine.AttachmentLoader
{
	private renderer: WebGLRenderer;
	private textureManager: TextureManager;

	/**
	 *
	 */
	public constructor( renderer: WebGLRenderer, textureManager: TextureManager )
	{
		this.renderer = renderer;
		this.textureManager = textureManager;
	}

	/**
	 *
	 */
	public newRegionAttachment( skin: spine.Skin, name: string, path: string ): spine.RegionAttachment
	{
		const isPlaceholder = ( name.indexOf( "Placeholders/" ) === 0 );
		const attachment = isPlaceholder ? new NodeAttachment( name ) : new RegionAttachment( this.renderer, this.textureManager, name );
		attachment.setRegion( this.newTextureRegion() );

		return attachment;
	}

	/**
	 *
	 */
	public newMeshAttachment( skin: spine.Skin, name: string, path: string ): MeshAttachment
	{
		const attachment = new MeshAttachment( this.renderer, this.textureManager, name );
		attachment.region = this.newTextureRegion();

		return attachment;
	}

	/**
	 *
	 */
	public newBoundingBoxAttachment( skin: spine.Skin, name: string ): spine.BoundingBoxAttachment
	{
		return new spine.BoundingBoxAttachment( name );
	}

	/**
	 *
	 */
	public newPathAttachment( skin: spine.Skin, name: string ): spine.PathAttachment
	{
		return new spine.PathAttachment( name );
	}

	/**
	 *
	 */
	public newPointAttachment( skin: spine.Skin, name: string ): spine.PointAttachment
	{
		return new spine.PointAttachment( name );
	}

	/**
	 *
	 */
	public newClippingAttachment( skin: spine.Skin, name: string ): spine.ClippingAttachment
	{
		return new ClipAttachment( this.renderer, name );
	}

	/**
	 *
	 */
	private newTextureRegion(): spine.TextureRegion
	{
		const region = new spine.TextureRegion();
		region.u = 0;
		region.v = 0;
		region.u2 = 1;
		region.v2 = 1;
		region.width = 1; // size in pixels on texture
		region.height = 1;
		region.originalWidth = 1; // size before cropping
		region.originalHeight = 1;
		region.offsetX = 0; // number of pixels cropped on the left side
		region.offsetY = 0;

		return region;
	}

}
