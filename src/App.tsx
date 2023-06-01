import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {useCallback, useMemo, useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ColDef,
    GridReadyEvent,
    ICellRendererParams,
    IDatasource,
} from 'ag-grid-community';

const App = () => {
    const [filterNumber,setFilterNumber] = useState(2)
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const columnDefs = [
        // this row shows the row index, doesn't use any data from the row
        {
            headerName: 'ID',
            maxWidth: 100,
            // it is important to have node.id here, so that when the id changes (which happens
            // when the row is loaded) then the cell is refreshed.
            valueGetter: 'node.id',
            cellRenderer: (props: ICellRendererParams) => {
                if (props.value !== undefined) {
                    return props.value;
                } else {
                    return (
                        <img src="https://www.ag-grid.com/example-assets/loading.gif" alt='random' />
                    );
                }
            },
        },
        { field: 'athlete', minWidth: 150 },
        { field: 'age' },
        { field: 'country', minWidth: 150 },
        { field: 'year' },
        { field: 'date', minWidth: 150 },
        { field: 'sport', minWidth: 150 },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' },
    ]
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            resizable: true,
            minWidth: 100,
        };
    }, []);


    const onGridReady = useCallback((params: GridReadyEvent) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data:{
                athlete: string;
                age: number;
                country: string;
                year: number;
                date: number;
                sport: string;
                gold: string;
                silver: number;
                bronze: number;
                total: number;
            }[]) => {

                const filteredData = data.filter(f=>f.age%filterNumber===0)

                console.log({filteredData,filterNumber})

                const dataSource: IDatasource = {
                    rowCount: undefined,
                    getRows: (params) => {

                        // At this point in your code, you would call the server.
                        // To make the demo look real, wait for 500ms before returning

                        // take a slice of the total rows
                        const rowsThisPage = filteredData.slice(params.startRow, params.endRow);
                        // if on or after the last page, work out the last row.
                        let lastRow = -1;
                        if (filteredData.length <= params.endRow) {
                            lastRow = filteredData.length;
                        }

                        // call the success callback
                        params.successCallback(rowsThisPage, lastRow);

                    },
                };
                params.api.setDatasource(dataSource);
            });
    }, [filterNumber]);


    return (
        <div style={containerStyle}>
            <button onClick={()=>setFilterNumber(3)}>3</button>
            <button onClick={()=>setFilterNumber(2)}>2</button>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowBuffer={0}
                    rowSelection={'multiple'}
                    rowModelType={'infinite'}
                    cacheBlockSize={100}
                    cacheOverflowSize={2}
                    maxConcurrentDatasourceRequests={1}
                    infiniteInitialRowCount={1000}
                    maxBlocksInCache={10}
                    onGridReady={onGridReady}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default App