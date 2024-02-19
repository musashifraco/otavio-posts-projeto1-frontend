import { render, screen } from "@testing-library/react"
import { Posts } from "."

const mock = {
    posts: [
        {
            id: 1,
            title: 'title 1',
            body: 'body 1',
            cover: 'img/img1.png',
        },
        {
            id: 2,
            title: 'title 2',
            body: 'body 2',
            cover: 'img/img2.png',
        },
        {
            id: 3,
            title: 'title 3',
            body: 'body 3',
            cover: 'img/img3.png',
        },
    ]


}

describe('<Posts />', () => {
    it('should render Post correctly', () => {
        render(<Posts />)

        expect(screen.queryByRole('heading', {name: /title/i})).not.toBeInTheDocument()
        // ou
        expect(screen.queryAllByRole('heading', {name: /title/i})).toHaveLength(0)
    })
    it('should render Post correctly', () => {
        render(<Posts {...mock} />)
        expect(screen.getAllByRole('heading', {name: /title/i})).toHaveLength(3)
        expect(screen.getAllByRole('img', {name: /title/i})).toHaveLength(3)
        expect(screen.getAllByText(/body/i)).toHaveLength(3)
    })

    it('should match snapshot', () => {
        const { container } = render(<Posts {...mock} />)
        expect(container.firstChild).toMatchSnapshot();
    })
})

