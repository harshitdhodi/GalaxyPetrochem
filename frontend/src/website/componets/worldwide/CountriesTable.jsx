export default function CountriesTable({ data, isIndiaTable = false }) {
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    const getColumnSize = () => (window.innerWidth < 640 ? 2 : 5); // 2 columns for small screens, 5 for larger screens

    if (!isIndiaTable) {
        const rows = chunkArray(data, getColumnSize());

        return (
            <div className="overflow-x-auto w-full">
                <table className="table-auto w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-800">
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((item, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-4 py-2 border border-gray-300 text-sm whitespace-normal"
                                    >
                                        <div className="text-gray-900">{item.name}</div>
                                    </td>
                                ))}
                                {[...Array(getColumnSize() - row.length)].map((_, i) => (
                                    <td
                                        key={`empty-${i}`}
                                        className="px-4 py-2 border"
                                    >
                                        <div className="text-sm text-gray-900"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const flatCells = data.reduce((acc, item) => {
        if (item.state) {
            acc.push({
                content: item.state,
                isState: true,
            });
        }
        item.cities.forEach((city) => {
            acc.push({
                content: city,
                isState: false,
            });
        });
        return acc;
    }, []);

    const rows = chunkArray(flatCells, getColumnSize());

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-auto w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-4 py-2 border text-sm whitespace-normal"
                                >
                                    <div className="text-gray-900">
                                        {cell.isState ? (
                                            <div className="font-bold">{cell.content}</div>
                                        ) : (
                                            <div>· {cell.content}</div>
                                        )}
                                    </div>
                                </td>
                            ))}
                            {[...Array(getColumnSize() - row.length)].map((_, i) => (
                                <td
                                    key={`empty-${i}`}
                                    className="px-4 py-2 border"
                                >
                                    <div className="text-sm text-gray-900"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
