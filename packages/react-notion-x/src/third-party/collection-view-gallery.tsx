import * as React from 'react'

import { PageBlock } from 'notion-types'

import { useNotionContext } from '../context'
import { CollectionViewProps } from '../types'
import { cs } from '../utils'
import { CollectionCard } from './collection-card'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'

const defaultBlockIds = []

export const CollectionViewGallery: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData,
  query
}) => {
  const isGroupedCollection = collectionView?.format?.collection_group_by

  if (isGroupedCollection) {
    const collectionGroups = getCollectionGroups(
      collection,
      collectionView,
      collectionData
    )

    return collectionGroups.map((group, index) => (
      <CollectionGroup
        query={query}
        key={index}
        {...group}
        collectionViewComponent={Gallery}
      />
    ))
  }

  const blockIds =
    (collectionData['collection_group_results']?.blockIds ??
      collectionData['results:relation:uncategorized']?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  return (
    <Gallery
      query={query}
      collectionView={collectionView}
      collection={collection}
      blockIds={blockIds}
    />
  )
}

function Gallery({ blockIds, collectionView, collection, query }) {
  const { recordMap } = useNotionContext()
  const {
    gallery_cover = { type: 'none' },
    gallery_cover_size = 'medium',
    gallery_cover_aspect = 'cover'
  } = collectionView.format || {}

  return (
    <div className='notion-gallery'>
      <div className='notion-gallery-view'>
        <div
          className={cs(
            'notion-gallery-grid',
            `notion-gallery-grid-size-${gallery_cover_size}`
          )}
        >
          {blockIds?.map((blockId) => {
            const block = recordMap.block[blockId]?.value as PageBlock
            if (!block) return null
            if (query) {
              if (
                collectionView.format?.gallery_properties
                  ?.filter((p) => {
                    return p.visible && collection.schema[p.property]
                  })
                  .filter((p) => {
                    const data = block.properties[p.property]?.[0]?.[0]
                    return data?.indexOf(query) >= 0
                  })?.length === 0
              )
                return null
            }

            return (
              <CollectionCard
                collection={collection}
                block={block}
                cover={gallery_cover}
                coverSize={gallery_cover_size}
                coverAspect={gallery_cover_aspect}
                properties={collectionView.format?.gallery_properties}
                key={blockId}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
