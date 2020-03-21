export interface IFntData
{
	readonly pages: Array< string >;
	readonly chars: Array< ICharacter >;
	readonly kernings: Array< IKerningPair >;
	readonly info: IInfo;
	readonly common: ICommonData;
}

export interface ICharacter
{
	readonly id: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly xoffset: number;
	readonly yoffset: number;
	readonly xadvance: number;
	readonly page: number;
	readonly chnl: number;
}

export interface IKerningPair
{
	readonly first: number;
	readonly second: number;
	readonly amount: number;
}

export interface ICommonData
{
	readonly lineHeight: number;
	readonly base: number;
	readonly scaleW: number;
	readonly scaleH: number;
	readonly pages: number;
	readonly packed: number;
}

export interface IInfo
{
	readonly face: string;
	readonly size: number;
	readonly bold: number;
	readonly italic: number;
	readonly charset: string;
	readonly unicode: number;
	readonly stretchH: number;
	readonly smooth: number;
	readonly aa: number;
	readonly padding: Array< number >;
	readonly spacing: Array< number >;
}
