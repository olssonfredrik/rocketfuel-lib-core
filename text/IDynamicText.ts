export interface IDynamicText
{
	NeedsUpdate(): boolean;
	GetText(): string;
}
