import './Header.css';

type HeaderProps = {
    onCategorySelect: (category: string) => void;
    onRefresh?: () => void;
};

function Header({ onCategorySelect, onRefresh }: HeaderProps) {

    return (
        <div id="header-bar">
            <ul>
                <li onClick={() => onCategorySelect('home')}>Home</li>
                <li onClick={() => onCategorySelect('TMX')}>최고기온</li>
                <li onClick={() => onCategorySelect('TMN')}>최저기온</li>
                <li onClick={() => onCategorySelect('POP')}>강수확률</li>
                <li onClick={() => onCategorySelect('WSD')}>풍속</li>
                <li onClick={onRefresh}>갱신</li>
            </ul>
        </div>
    );
}

export default Header;