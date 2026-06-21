'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Pagination } from '@heroui/react';

export default function ForumPagination({ currentPage, totalPages, totalPosts, postsPerPage }) {
    const router = useRouter();
    const pathname = usePathname();

    const handlePageChange = (page) => {
        if (page === 1) {
            router.push('/forum');
        } else {
            router.push(`/forum?page=${page}`);
        }
    };

    const startIndex = (currentPage - 1) * postsPerPage;

    if (totalPages <= 1) return null;

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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show ellipsis logic
                        if (totalPages > 7) {
                            if (page > 3 && page < totalPages - 2 && page !== currentPage && 
                                (page < currentPage - 2 || page > currentPage + 2)) {
                                if (page === 4 || page === totalPages - 3) {
                                    return (
                                        <Pagination.Item key={`ellipsis-${page}`}>
                                            <Pagination.Ellipsis />
                                        </Pagination.Item>
                                    );
                                }
                                return null;
                            }
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