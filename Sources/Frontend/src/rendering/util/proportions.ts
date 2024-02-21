function getProportionateHeight(wScale: number, hScale: number, widthValue: number)
{
    return (widthValue / wScale) * hScale;
}
function getProportionateWidth(wScale: number, hScale: number, widthValue: number)
{
    return (widthValue / hScale) * wScale;
}

export {
    getProportionateHeight,
    getProportionateWidth
}