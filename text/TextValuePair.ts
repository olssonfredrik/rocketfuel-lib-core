import { IDataRead } from "../data";
import { IDynamicText } from "./IDynamicText";

export class TextValuePair implements IDynamicText
{
	private readonly text: string;
	private readonly value: IDataRead< number >;
	private cache: number;

	/**
	 *
	 */
	public constructor( text: string, value: IDataRead< number > )
	{
		this.text = text;
		this.value = value;
		this.cache = Number.NaN;
	}

	/**
	 *
	 */
	public NeedsUpdate(): boolean
	{
		return ( this.cache !== this.value.Get() );
	}

	/**
	 *
	 */
	public GetText(): string
	{
		this.cache = this.value.Get();
		return this.text + this.value.GetText();
	}
}
