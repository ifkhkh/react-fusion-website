class Request {
    static getList() {
        return new Promise((resolve) => {
            const resp = {
                success: true,
                data: [
                    {
                        id: 1,
                        name: 'dmdm1',
                        hair: {
                            color: 'gray1',
                        },
                        pigu: 'big1',
                    },
                    {
                        id: 2,
                        name: 'dmdm2',
                        hair: {
                            color: 'gray2',
                        },
                        pigu: 'big2',
                    },
                    {
                        id: 3,
                        name: 'dmdm3',
                        hair: {
                            color: 'gray3',
                        },
                        pigu: 'big3',
                    },
                    {
                        id: 4,
                        name: 'dmdm4',
                        hair: {
                            color: 'gray4',
                        },
                        pigu: 'big4',
                    },
                ],
            }
            const t = setTimeout(() => {
                resolve(resp)
                clearTimeout(t)
            }, 300)
        })
    }
}

export default Request
