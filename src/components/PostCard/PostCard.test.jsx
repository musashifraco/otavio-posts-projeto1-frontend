import { render, screen } from "@testing-library/react"
import { PostCard } from "."

const mock = {
    title: 'title 1',
    body: 'body 1', 
    id: 1,
    cover: 'img/img.png',
}

describe('<PostCard />', () => {
    it('should render PostCard correctly', () => {
        render(<PostCard {...mock}/>)
        expect(screen.getByAltText(/title 1/i).toggleAttribute('img', 'img/img.png'))
        expect(screen.getByRole('heading', {name: 'title 1 1'}))
        expect(screen.getByText('body 1')).toBeInTheDocument()

    })

    it('should match snapshot', () => {
        const { container } = render(<PostCard {...mock} />)
        expect(container.firstChild).toMatchSnapshot()
    });
})