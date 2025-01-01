import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const resolution = searchParams.get('resolution');
  
  try {
    if (!from || !to) {
        return NextResponse.json({ error: 'from and to are required' }, { status: 400 });
    }
    const response = await fetch(
      `https://frontend-api-v2.pump.fun/candlesticks/${token}?offset=0&limit=1000&timeframe=5`
    );
    // const data = (await response.json()).slice(-20);
    const data = await response.json();
    // console.log("data===============", data)
    console.log("resolution", resolution)
    console.log("from", from)
    console.log("to", to)
    const chartData = await data
        .filter((item: any) => {
            return item.timestamp >= from && item.timestamp <= to;
        })
        .map((item: any) => ({
            time: item.timestamp * 1000, // Convert to milliseconds
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            close: parseFloat(item.close),
            volume: parseFloat(item.volume)
        }));
    console.log("chartData===============", chartData.length)
    return NextResponse.json(chartData);

  } catch (error) {
    console.error('Error fetching candlestick data:', error);
    return NextResponse.json({ error: 'Failed to fetch candlestick data' }, { status: 500 });
  }
} 