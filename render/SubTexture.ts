import { Point2D } from "../math";
import { Texture } from "./Texture";

export class SubTexture
{
	public readonly Texture: Texture;
	public readonly Position: Array< number >;
	public readonly Size: Point2D;

	/**
	 *
	 */
	constructor( texture: Texture, position: Array< number > )
	{
		this.Texture = texture;
		this.Position = position;
		this.Size = new Point2D( Math.round( position[ 2 ] * texture.Size.X ), Math.round( position[ 3 ] * texture.Size.Y ) );
	}
}
