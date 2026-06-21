'use client';

import { useRouter } from 'next/navigation';
import { Pagination } from '@heroui/react';

export default function ForumPagination({ currentPage, totalPages, totalPosts, postsPerPage }) {
    const router = useRouter();

    const handlePageChange = (page) => {
        if (page === 1) {
            router.push('/forum');
        } else {
            router.push(`/forum?page=${page}`);
        }
    };

    const startIndex = (currentPage - 1) * postsPerPage;

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const delta = 1;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            pages.push(1, 'ellipsis-start');
        } else {
            pages.push(1);
        }

        pages.push(...range);

        if (currentPage + delta < totalPages - 1) {
            pages.push('ellipsis-end', totalPages);
        } else if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="w-full flex flex-col items-center justify-center gap-2 mt-10">
            <Pagination>
                <Pagination.Summary className="text-xs text-zinc-500">
                    Showing {startIndex + 1}-{Math.min(startIndex + postsPerPage, totalPosts)} of {totalPosts} posts
                </Pagination.Summary>

                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.Previous
                            isDisabled={currentPage === 1}
                            onPress={() => handlePageChange(currentPage - 1)}
                        >
                            <Pagination.PreviousIcon />
                            <span>Previous</span>
                        </Pagination.Previous>
                    </Pagination.Item>

                    {pageNumbers.map((page, index) => {
                        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                            return (
                                <Pagination.Item key={`ellipsis-${index}`}>
                                    <Pagination.Ellipsis />
                                </Pagination.Item>
                            );
                        }
                        return (
                            <Pagination.Item key={page}>
                                <Pagination.Link
                                    isActive={page === currentPage}
                                    onPress={() => handlePageChange(page)}
                                >
                                    {page}
                                </Pagination.Link>
                            </Pagination.Item>
                        );
                    })}

                    <Pagination.Item>
                        <Pagination.Next
                            isDisabled={currentPage === totalPages}
                            onPress={() => handlePageChange(currentPage + 1)}
                        >
                            <span>Next</span>
                            <Pagination.NextIcon />
                        </Pagination.Next>
                    </Pagination.Item>
                </Pagination.Content>
            </Pagination>
        </div>
    );
}