/* eslint-disable no-nested-ternary */
import * as React from "react"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra,
    Input,
    Box,
    Center,
    Checkbox,
    HStack,
    Spinner,
    Button,
    Stack,
    Grid,
    GridItem,
} from "@chakra-ui/react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    TriangleDownIcon,
    TriangleUpIcon,
} from "@chakra-ui/icons"
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    ColumnDef,
    SortingState,
    getSortedRowModel,
    getPaginationRowModel,
    PaginationState,
    getFilteredRowModel,
} from "@tanstack/react-table"
import Link from "next/link"
import { useContext, useState } from "react"
import { MediaContext } from "@/lib/contexts/MediaContext"
import { ApiGetResponse } from "@/lib/types/hooks"
import _ from "lodash"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import { Role } from "@/lib/types/auth"

type PaginationButtonProps = {
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    pageCount: number
    pageIndex: number
}

const PaginationButtons = ({
    setPagination,
    pageCount,
    pageIndex,
}: PaginationButtonProps) =>
    pageCount > 1 ? (
        <Center m={0}>
            <Button
                onClick={() =>
                    setPagination((p) => ({
                        ...p,
                        pageIndex: Math.max(p.pageIndex - 1, 0),
                    }))
                }
            >
                <ArrowLeftIcon />
            </Button>
            <span
                style={{
                    marginLeft: "30px",
                    marginRight: "30px",
                }}
            >
                {pageIndex + 1} / {pageCount}
            </span>
            <Button
                onClick={() =>
                    setPagination((p) => ({
                        ...p,
                        pageIndex: Math.min(p.pageIndex + 1, pageCount - 1),
                    }))
                }
            >
                <ArrowRightIcon />
            </Button>
        </Center>
    ) : (
        <></>
    )

type TableButtonsProps = PaginationButtonProps & {
    actionButton?: ActionButton
}

const TableButtons = ({
    actionButton,
    setPagination,
    pageCount,
    pageIndex,
}: TableButtonsProps) => {
    const { isLarge } = React.useContext(MediaContext)

    return isLarge ? (
        <Box m={4} pt={4}>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem w="100%" h="10" />
                <GridItem w="100%" h="10">
                    <PaginationButtons
                        setPagination={setPagination}
                        pageCount={pageCount}
                        pageIndex={pageIndex}
                    />
                </GridItem>
                <GridItem w="100%" h="10" textAlign="right">
                    {actionButton && (
                        <Button
                            mr="auto"
                            background="green.300"
                            color="white"
                            onClick={actionButton.onClick}
                            isLoading={actionButton.isLoading}
                        >
                            {actionButton.text}
                        </Button>
                    )}
                </GridItem>
            </Grid>
        </Box>
    ) : (
        <Stack spacing="24px" m={8}>
            <PaginationButtons
                setPagination={setPagination}
                pageCount={pageCount}
                pageIndex={pageIndex}
            />
            {actionButton && (
                <Center>
                    <Button
                        background="green.300"
                        color="white"
                        onClick={actionButton.onClick}
                        isLoading={actionButton.isLoading}
                    >
                        {actionButton.text}
                    </Button>
                </Center>
            )}
        </Stack>
    )
}

export type LinkWrapperProps<T> = {
    children: JSX.Element
    item: T
    getLink?: (item: T) => string
}

const LinkWrapper = <T,>({ children, item, getLink }: LinkWrapperProps<T>) =>
    getLink ? <Link href={getLink(item)}>{children}</Link> : <>{children}</>

export type ActionButton = {
    text: string
    onClick: () => void
    isLoading?: boolean
}

export type ItemTableProps<T> = {
    response: ApiGetResponse<T[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[]
    archivedFilter?: (item: T) => boolean
    tableHeight?: string
    onOpenDetail?: (item: T) => void
    rowLink?: (item: T) => string
    searchPlaceholder?: string
    actionButton?: ActionButton
    customFilters?: ((item: T) => boolean)[]
    defaultSort?: (items: T[]) => T[]
}

const ItemTable = <T,>(props: ItemTableProps<T>) => {
    const [displayArchived, setDisplayArchived] = useState(false)
    const [search, setSearch] = useState("")

    const { isLarge } = useContext(MediaContext)
    const { role } = useContext(AuthContext)

    const customFilter = (items: T[]) =>
        _.reduce(props.customFilters || [], (a, f) => a.filter(f), items)
    const af =
        props.archivedFilter && !displayArchived
            ? props.archivedFilter
            : () => true
    const filterFn = (items: T[]) => customFilter(items).filter(af)

    const sort = props.defaultSort ? props.defaultSort : (x: T[]) => x
    const prepareItems = (items: T[]) => sort(filterFn(items))

    const headerItems = (
        <>
            <Input
                onChange={({ target }) => setSearch(target.value)}
                mt={4}
                mb={4}
                placeholder={props.searchPlaceholder}
                width={"200px"}
                ml={"auto"}
            />
            {role === Role.ADMIN && !_.isUndefined(props.archivedFilter) && (
                <Box ml={"auto"}>
                    <Checkbox
                        checked={displayArchived}
                        onChange={({ target }) =>
                            setDisplayArchived(target.checked)
                        }
                    >
                        Show archived
                    </Checkbox>
                </Box>
            )}
        </>
    )

    const height = isLarge ? "300px" : "400px"

    return (
        <Box>
            <Box width={"100%"} textAlign="right">
                {isLarge ? (
                    <HStack spacing="24px">{headerItems}</HStack>
                ) : (
                    <Stack>{headerItems}</Stack>
                )}
            </Box>
            <Box height={props.tableHeight || height} m={4}>
                {props.response.isSuccess ? (
                    <InnerTable
                        {...props}
                        columns={
                            isLarge ? props.columns : props.columns.slice(0, 1)
                        }
                        data={prepareItems(props.response.data)}
                        search={search}
                    />
                ) : (
                    <Center height="100%">
                        <Spinner size="xl" />
                    </Center>
                )}
            </Box>
        </Box>
    )
}

export type InnerTableProps<T> = ItemTableProps<T> & {
    search: string
    data: T[]
}

const InnerTable = <T,>({
    data,
    columns,
    onOpenDetail,
    rowLink,
    search,
    actionButton,
}: InnerTableProps<T>) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 3,
    })

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getFilteredRowModel: getFilteredRowModel(),
        autoResetPageIndex: false,
        state: {
            sorting,
            pagination,
            globalFilter: search,
        },
    })

    const pageIndex = Math.max(
        Math.min(table.getPageCount() - 1, pagination.pageIndex),
        0
    )

    if (pageIndex < pagination.pageIndex) {
        setPagination((p) => ({ ...p, pageIndex }))
    }

    return (
        <>
            <Box height="200px">
                <Table layout={"fixed"} width="full">
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}

                                        <chakra.span pl="4">
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() ===
                                                "desc" ? (
                                                    <TriangleDownIcon aria-label="sorted descending" />
                                                ) : (
                                                    <TriangleUpIcon aria-label="sorted ascending" />
                                                )
                                            ) : null}
                                        </chakra.span>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map((row) => (
                            <LinkWrapper
                                key={row.id}
                                getLink={rowLink}
                                item={row.original}
                            >
                                <Tr
                                    _hover={{
                                        background: "cyan.400",
                                        color: "white",
                                    }}
                                    onClick={() => {
                                        if (onOpenDetail) {
                                            onOpenDetail(row.original)
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    ))}
                                </Tr>
                            </LinkWrapper>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <TableButtons
                actionButton={actionButton}
                setPagination={setPagination}
                pageCount={table.getPageCount()}
                pageIndex={pagination.pageIndex}
            />
        </>
    )
}

export default ItemTable
