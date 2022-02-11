import { useCallback, useState, useRef } from "react";
import useBookSearch from "./useBookSearch";


function App() {

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const {
    books,
    hasMore,
    isLoading
  } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookRef = useCallback((node)=>{
    if(isLoading) return
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(oldValue=> oldValue +1)
      }
    })
    if(node) observer.current.observe(node)
  })

  const handleSearch = (e) =>{
    setQuery(e.target.value)
  }

  return (
    <div>
      <input onChange={handleSearch} type='text' value={query}></input>
      <ul>
      {books.map((book, index)=> {
      if(index === books.length -1){
        return <li ref={lastBookRef} key={book}>{book}</li>
      }else{
        return <li key={book}>{book}</li>
      }
      
      })}
      </ul>
      {isLoading?
      <div>Loading...</div>:
      null
      }
    </div>
  );
}

export default App;
