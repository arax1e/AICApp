const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);

    //passes back the state and a function called dispatch
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data1: initialData
    });

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            dispatch({ type: "FETCH_INIT" });
            try {
                const result = await axios(url);
                if(!didCancel) {
                    dispatch({ type: "FETCH_SUCCESS", payload: result.data });
                }
            } catch (error) {
                if(!didCancel) {
                    dispatch({ type: "FETCH_FAILURE" });
                }
            }
        };

        fetchData();
        return () => {
            didCancel = true;
        };
    }, [url]);
    return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
    switch(action.type) {
        case "FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case "FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data1: action.payload
            };
        case "FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true
            };
            default:
            throw new Error();
    }
};

function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("cats");
   
    const [{ data1, isLoading, isError }, doFetch] = useDataApi(
        "https://api.artic.edu/api/v1/artworks/search?q=cats",
        {
            data: []
        }
    );
    console.log(data1.data[0]);

    return (
        <Fragment>
            <form
            onSubmit={event => {
                doFetch(`https://api.artic.edu/api/v1/artworks/search?q=${query}`);
                event.preventDefault();
            }}>
                <input
                    type="text"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    />
                    <button type="submit">Search</button>
            </form>
            {isError && <div>Something went wrong...</div>}

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {data1.data.map(item => (
                       <li key={item.id}>
                           {item.title}
                        </li>
                    ))}
                </ul>
            )}
        </Fragment>
    );
}

// ==================================
ReactDOM.render(<App />, document.getElementById("root"));

/* */