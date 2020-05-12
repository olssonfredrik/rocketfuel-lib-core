import { IMutableTextItem } from "./IMutableTextItem";
import { ITextItem } from "./ITextItem";

export class MutableTextItem implements ITextItem, IMutableTextItem
{
	private text: string;

	/**
	 *
	 */
	public constructor( text: string )
	{
		this.text = text;
	}

	/**
	 *
	 */
	public SetText( text: string )
	{
		this.text = text;
	}

	/**
	 *
	 */
	public GetText(): string
	{
		return this.text;
	}
}
