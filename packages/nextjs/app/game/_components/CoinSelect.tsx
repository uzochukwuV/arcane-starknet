"use client"

export default function CoinSelect({ coins, selected, setCoin }: { coins: string[], selected: string, setCoin: any }) {

    return (
        <>
            <div>
                <label id="listbox-label" className="block text-sm/6 font-medium text-gray-900">Pay with </label>
                <select value={selected} name="coins" onChange={setCoin} className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"  aria-expanded="true" aria-labelledby="listbox-label">
                    {
                        coins.map((coin) => {
                            return <option key={coin} value={coin}>
                                <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                    <span className="block truncate">{coin}</span>
                                </span>
                                <svg className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                                </svg>
                            </option>
                        })
                    }
                </select>
            </div>

        </>
    )
}