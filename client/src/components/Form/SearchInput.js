import React from 'react'
import { useSearch } from "../../context/search"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const SearchInput = () => {
    const [values, setValues] = useSearch()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`)
            setValues({ ...values, results: data });
            navigate('/search')
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button className="custom-btn"
                    style={{ backgroundColor: "black", color: "white", border: "1px solid white" }}
                    type="submit">
                    Search
                </button>
            </form>
        </div>
    )
}

export default SearchInput