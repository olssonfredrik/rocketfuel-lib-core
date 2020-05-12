import { IDynamicText } from "./IDynamicText";
import { ITextItem } from "./ITextItem";

export class TextTextItemPair implements IDynamicText
{
	private readonly text: string;
	private readonly value: ITextItem;
	private cache: string;

	/**
	 *
	 */
	public constructor( text: string, value: ITextItem )
	{
		this.text = text;
		this.value = value;
		this.cache = value.GetText();
	}

	/**
	 *
	 */
	public NeedsUpdate(): boolean
	{
		return ( this.cache !== this.value.GetText() );
	}

	/**
	 *
	 */
	public GetText(): string
	{
		this.cache = this.value.GetText();
		return this.text + this.value.GetText();
	}
}
