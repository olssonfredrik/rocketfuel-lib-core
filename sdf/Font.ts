import { RenderPass } from "./RenderPass";
import { ITextLayoutConfig } from "./SdfManager";
import { Typeface } from "./Typeface";

export class Font
{
	public readonly Texture: string;
	public readonly RenderPasses: Array< RenderPass >;
	public readonly Typeface: Typeface;
	public readonly Layout: ITextLayoutConfig;

	public constructor( typeface: Typeface, renderPasses: Array< RenderPass >, layout: ITextLayoutConfig )
	{
		this.RenderPasses = renderPasses;
		this.Typeface = typeface;
		this.Texture = typeface.Texture;
		this.Layout = layout;
	}
}
