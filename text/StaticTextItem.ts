import { ITextItem } from "./ITextItem";

export class StaticTextItem implements ITextItem
{
	private readonly text: string;

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
	public GetText(): string
	{
		return this.text;
	}
}
