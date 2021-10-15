import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

const typeList = [
    { value: 1, title: 'Forsiden (innstillinger)' },
    { value: 2, title: 'Annonser i artikler' },
    { value: 3, title: 'Annonser på forsiden øvre' },
    { value: 4, title: 'Annonser på forsiden nedre' },
    { value: 22, title: 'Annonser på forsiden nest nedre' },
    { value: 5, title: 'Bildegalleri' },
    { value: 9, title: 'Blog w/wide image' },
    { value: 6, title: 'Lenker' },
    { value: 7, title: 'Bunnsaker' },
    { value: 23, title: 'Annonser i artikler nest nedre' },
    { value: 8, title: 'Annonser i artikler nedre' },
    { value: 19, title: 'Spesialløsninger innhold' },
    { value: 18, title: 'Spesialløsninger innhold nedre' },
    { value: 20, title: 'Annonser i spesialløsninger øvre' },
    { value: 21, title: 'Annonser i spesialløsningernedre' },
    { value: 24, title: 'Forsiden under toppsak' },
];

export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const catlist = props.catlist;
        const handleListClick = props.handleListClick;
        const handleClickNew = props.handleClickNew;

        return (
            <div class='col-12'>
                <div class='row mb-2'>
                    <div class="col-12 col-sm-10 col-md-10">
                        &nbsp;
                    </div>
                    <div class="col-12 col-sm-2 col-md-2 text-right mb-2">
                        <button class='btn btn-info float-right ml-2' onClick={e => handleClickNew(e, { title: 'Trenger en fin ny tittel' })}>
                            + Ny kategori
                        </button>
                    </div>
                    <table class={`table table-sm table-striped ${styles.condensed}`}>
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'><p>Bilde</p></th>
                                <th scope='col'><p>Tittel</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Meny</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Dropp default artlink</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul menytittel</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul på forsiden</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul oversettings linker</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkel toppbilde</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkel forrige-neste linker</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkel artikkelliste</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkelliste metainfo</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkel metainfo</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkel metainfo utvidet</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul artikkel forfatterinfo</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul forside artikkeltittel</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul forside artikkelteaser</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul forside paginering</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Skjul kategoriforside toppartikkel</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Kategori ID</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Sort</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Type</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>URL</p></th>
                                <th class={styles.verticalTableHeaderFOO} scope='col'><p>Opprettet</p></th>
                            </tr>
                        </thead>
                    <tbody>
                    {catlist.map(cat =>
                        <tr data-id={cat.id} onClick={handleListClick} class={`${!cat.menu && cat.type !== 1 && 'text-muted'} 
                            ${cat.type === 1 && 'bg-info text-white'} ${cat.menu && 'font-weight-bolder'} `}>
                            <td scope='row'>{cat.id}</td>
                            <td>{cat.image && <img src={cat.image} style='max-height: 30px;' />}</td>
                            <td>
                                {cat.menu > 0 && <i class='fas fa-bars mr-2' />}
                                {[2, 3, 4, 8, 22, 23].indexOf(cat.type) !== -1 && <i class='fas fa-ad mr-2' />}
                                {[1].indexOf(cat.type) !== -1 && <i class='fas fa-cogs mr-2' />}
                                {[5].indexOf(cat.type) !== -1 && <i class='fas fa-image mr-2' />}
                                {[6].indexOf(cat.type) !== -1 && <i class='fas fa-link mr-2' />}
                                {[7].indexOf(cat.type) !== -1 && <i class='fas fa-download mr-2' />}
                                {!cat.type && !cat.menu && <i class='fas fa-question mr-2' />}

                                {cat.title}
                                {cat.titleEn && <span>
                                    <br />🇬🇧 {cat.titleEn} 
                                </span>}
                            </td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.menu ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.skipDefaultArtLink ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideTitle ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideOnFrontpage ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideTranslateLinks ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideTopImage ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hidePrevNext ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideArticleList ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideMetaInfo ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideMetaInfoDetail ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideMetaInfoDetailAdvanced ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideAuthorInfo ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideFrontpageTitle ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideFrontpageTeaser ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideFrontpagePagination ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-center' style='font-size: 2.0em;'><i class={`${cat.hideCategoryTopArticle ? `fas fa-check text-success` : 'fas fa-times-circle text-danger'}`} /></td>
                            <td class='text-right'>{cat.artlistCategory}</td>
                            <td class='text-right'>{cat.sort}</td>
                            <td>
                                {cat.type ? typeList.find(x => x.value === cat.type).title : ''}
                            </td>
                            <td>{cat.url}</td>
                            <td>
                                {util.isoDateNormalized(cat.createdDate)}<br />
                                {cat.createdDate !== cat.updatedDate && <span class='text-muted'>
                                    <small><i class="fas fa-user-edit"></i> {util.isoDateNormalized(cat.updatedDate)}</small>
                                </span>}
                            </td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
