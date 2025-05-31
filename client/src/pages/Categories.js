import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import "../styles/AllCategoriesStyles.css";
import "../styles/CategoryProductStyles.css";
import { InfinitySpin } from 'react-loader-spinner';

const Categories = () => {
    const categories = useCategory();
    const [loading, setLoading] = useState(true);

    // Wait until categories are fetched
    useEffect(() => {
        if (categories?.length > 0) {
            setLoading(false);
        }
    }, [categories]);

    if (loading) {
        return (
            <Layout title="Loading...">
                <div className="loading-container">
                    <InfinitySpin width="200" color="#0d6efd" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="All Categories">
            <div className="container my-5">
                <h2 className="text-center mb-4">All Categories</h2>
                <div className="row">
                    {categories.map((c) => (
                        <div className="col-md-4 col-sm-6 mb-4" key={c?._id}>
                            <div className="cat-bg text-center shadow-sm h-100 d-flex justify-content-center align-items-center">
                                <Link
                                    to={`/category/${c.slug}`}
                                    className="cat-btn w-75"
                                >
                                    {c?.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Categories;
